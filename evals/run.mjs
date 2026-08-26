#!/usr/bin/env node
/**
 * Lumen eval harness.
 *
 *   npm run eval                  — everything
 *   npm run eval -- patient       — only specs whose name matches "patient"
 *   npm run eval -- "pe /"        — only the PE case specs
 *
 * Runs against a live dev server so the real route handlers, validation and prompts
 * are all exercised. Exits non-zero on any failure, so it can gate a deploy.
 */
import { specs } from "./specs.mjs";
import { conveys } from "./judge.mjs";

const BASE = process.env.EVAL_BASE_URL ?? "http://localhost:3001";
// The suite intentionally exceeds the public per-IP limits; bypass them.
const HEADERS = {
  "Content-Type": "application/json",
  ...(process.env.RATE_LIMIT_BYPASS_TOKEN
    ? { "x-ratelimit-bypass": process.env.RATE_LIMIT_BYPASS_TOKEN }
    : {}),
};
const CONCURRENCY = Number(process.env.EVAL_CONCURRENCY ?? 4);
const filter = process.argv[2]?.toLowerCase();

const C = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

async function readStream(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

/** One retry for transient stream failures — but the retry is reported, never hidden. */
async function fetchPatientReply(spec) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ caseId: spec.caseId, messages: spec.messages }),
    });
    if (!res.ok) return { error: `HTTP ${res.status} from /api/chat`, attempt };

    const reply = (await readStream(res)).trim();
    if (reply && !reply.startsWith("[")) return { reply, attempt };

    // Transient: empty body, or the route's own bracketed error marker.
    if (attempt === 2) {
      return { error: reply ? `stream error: ${reply.slice(0, 80)}` : "empty reply", attempt };
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
}

async function runPatientSpec(spec) {
  const { reply, error, attempt } = await fetchPatientReply(spec);
  if (error) return { fails: [error] };
  const retried = attempt > 1;

  const fails = [];

  // Judge calls are independent — run them together rather than serially.
  const [shouldNot, should] = await Promise.all([
    Promise.all((spec.mustNotConvey ?? []).map((f) => conveys(reply, f).then((v) => [f, v]))),
    Promise.all((spec.mustConvey ?? []).map((f) => conveys(reply, f).then((v) => [f, v]))),
  ]);

  for (const [fact, v] of shouldNot) {
    if (v.disclosed) fails.push(`LEAKED ${fact} — "${v.quote.slice(0, 70)}"`);
  }
  for (const [fact, v] of should) {
    if (!v.disclosed) fails.push(`WITHHELD ${fact}`);
  }
  return { fails, retried, sample: reply.replace(/\s+/g, " ").slice(0, 110) };
}

async function runEndpointSpec(spec) {
  const res = await fetch(`${BASE}${spec.path}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(spec.body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return { fails: [`HTTP ${res.status}: ${data?.error ?? "no body"}`] };
  }
  try {
    return { fails: await spec.check(data) };
  } catch (e) {
    return { fails: [`check threw: ${e.message}`] };
  }
}

async function runSpec(spec) {
  const started = Date.now();
  try {
    const out = spec.kind === "patient" ? await runPatientSpec(spec) : await runEndpointSpec(spec);
    return { ...spec, ...out, ms: Date.now() - started };
  } catch (e) {
    return { ...spec, fails: [`threw: ${e.message}`], ms: Date.now() - started };
  }
}

/** Simple worker pool — these calls are slow and rate limits are real. */
async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      for (;;) {
        const i = next++;
        if (i >= items.length) return;
        results[i] = await fn(items[i]);
        const r = results[i];
        const mark = r.fails.length === 0 ? C.green("PASS") : C.red("FAIL");
        const flake = r.retried ? C.yellow(" (retried)") : "";
        console.log(
          `  ${mark}  ${r.name}${flake} ${C.dim(`${(r.ms / 1000).toFixed(1)}s`)}`,
        );
        for (const f of r.fails) console.log(`        ${C.red("·")} ${f}`);
      }
    }),
  );
  return results;
}

const selected = filter ? specs.filter((s) => s.name.toLowerCase().includes(filter)) : specs;

if (selected.length === 0) {
  console.error(C.red(`No specs match "${filter}".`));
  process.exit(1);
}

// Fail fast and legibly rather than emitting N identical auth errors.
try {
  const ping = await fetch(`${BASE}/api/order`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ caseId: "pe-okafor", orderId: "ecg" }),
  });
  if (!ping.ok) throw new Error(`server responded ${ping.status}`);
} catch (e) {
  console.error(C.red(`Cannot reach the dev server at ${BASE} — ${e.message}`));
  console.error(C.dim("Start it with:  npm run dev -- -p 3001"));
  process.exit(1);
}

console.log(
  C.bold(`\nLumen evals`) +
    C.dim(` — ${selected.length} spec${selected.length === 1 ? "" : "s"}, concurrency ${CONCURRENCY}, ${BASE}\n`),
);

const t0 = Date.now();
const results = await pool(selected, CONCURRENCY, runSpec);
const failed = results.filter((r) => r.fails.length > 0);

const retriedCount = results.filter((r) => r.retried).length;
if (retriedCount > 0) {
  console.log(
    C.yellow(
      `\n  ${retriedCount} spec${retriedCount === 1 ? "" : "s"} passed only after a retry — transient, but worth watching.`,
    ),
  );
}

console.log(
  `\n${C.bold("Result")}  ` +
    `${C.green(`${results.length - failed.length} passed`)}  ` +
    `${failed.length ? C.red(`${failed.length} failed`) : C.dim("0 failed")}  ` +
    C.dim(`in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`),
);

if (failed.length) {
  console.log(C.yellow("Failing specs:"));
  for (const f of failed) console.log(`  ${f.name}`);
  console.log();
  process.exit(1);
}
