/**
 * Per-IP request limiting, plus a global circuit breaker.
 *
 * WHAT THIS IS FOR: every model-backed route here costs real money — the medication
 * route sends several thousand tokens of FDA labelling at high effort. Unlimited
 * public access to that is an unbounded bill, and a drained balance mid-launch takes
 * the whole product down.
 *
 * WHAT THIS IS NOT: durable. State lives in the process, so on serverless each
 * instance keeps its own counters and a cold start resets them. That makes this a
 * meaningful brake on a single client hammering one instance, not a guarantee against
 * a distributed attacker. For anything beyond a launch window, move the counters to
 * Vercel KV or Upstash Redis — the call sites below would not need to change.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type Limit = { requests: number; windowMs: number };

/** Model-backed and expensive: a few thousand tokens at high effort per call. */
export const EXPENSIVE: Limit = { requests: 8, windowMs: 10 * 60_000 };

/** Conversational — a single history-taking encounter is legitimately many turns. */
export const CONVERSATIONAL: Limit = { requests: 60, windowMs: 10 * 60_000 };

/** No model involved; effectively free to serve. */
export const CHEAP: Limit = { requests: 200, windowMs: 10 * 60_000 };

/**
 * Ceiling across all callers on this instance. Catches the case a per-IP limit
 * cannot: many addresses each staying politely under their own allowance.
 */
const GLOBAL: Limit = { requests: 400, windowMs: 60 * 60_000 };

/** Stale buckets would otherwise accumulate for every IP ever seen. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function take(key: string, limit: Limit, now: number) {
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
    return { ok: true, retryAfterSec: 0, remaining: limit.requests - 1 };
  }
  if (existing.count >= limit.requests) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      remaining: 0,
    };
  }
  existing.count += 1;
  return { ok: true, retryAfterSec: 0, remaining: limit.requests - existing.count };
}

/**
 * Best-effort client identity. x-forwarded-for is set by the platform edge; the
 * leftmost entry is the original client. It is spoofable in principle, which is
 * part of why the global ceiling exists as a backstop.
 */
export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns a 429 Response when the caller should be turned away, or null to proceed.
 * Checks the global ceiling first so one noisy source cannot exhaust the budget for
 * everyone else and still be told it has requests remaining.
 */
export function checkLimit(req: Request, route: string, limit: Limit): Response | null {
  // Trusted callers (the eval suite, load testing) bypass the limiter so a re-run
  // does not throttle itself. Only active when the secret is configured, so this
  // is inert in any deployment that does not set it.
  const bypass = process.env.RATE_LIMIT_BYPASS_TOKEN;
  if (bypass && req.headers.get("x-ratelimit-bypass") === bypass) return null;

  const now = Date.now();
  sweep(now);

  const global = take("__global__", GLOBAL, now);
  if (!global.ok) {
    return Response.json(
      { error: "Lumen is unusually busy right now. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(global.retryAfterSec) } },
    );
  }

  const perClient = take(`${route}:${clientKey(req)}`, limit, now);
  if (!perClient.ok) {
    const minutes = Math.ceil(perClient.retryAfterSec / 60);
    return Response.json(
      {
        error: `You've used your requests for now — this one is limited to keep Lumen free and available. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      },
      { status: 429, headers: { "Retry-After": String(perClient.retryAfterSec) } },
    );
  }

  return null;
}
