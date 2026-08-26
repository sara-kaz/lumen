"use client";

import { useRef, useState } from "react";
import { IrisSays, LevelPicker } from "@/components/Iris";
import { BottomLine, Collapsible } from "@/components/Collapsible";
import { Feedback } from "@/components/Feedback";
import { LEVEL_COPY, LEVELS, type ExpertiseLevel, type Explanation } from "@/lib/explain";

const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.gif";
const MAX_BYTES = 8 * 1024 * 1024;

const STATUS_DOT: Record<string, string> = {
  low: "bg-warn",
  high: "bg-warn",
  borderline: "bg-warn/60",
  normal: "bg-accent",
  unknown: "bg-muted",
};

const URGENCY: Record<Explanation["urgency"], { label: string; className: string }> = {
  routine: {
    label: "Nothing here needs urgent attention",
    className: "border-accent-dim bg-accent-dim/10",
  },
  discuss_soon: {
    label: "Worth a conversation in the next few days",
    className: "border-warn/60 bg-warn/10",
  },
  seek_care_promptly: {
    label: "Please get medical attention today",
    className: "border-danger bg-danger/10",
  },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * The at-a-glance tally.
 *
 * Reports focus attention on flagged values, so people finish reading convinced
 * everything is wrong. Showing how many were fine — first, and by count — is the
 * single cheapest piece of reassurance this page can offer, and it is true.
 */
function Glance({ analytes }: { analytes: Explanation["analytes"] }) {
  const fine = analytes.filter((a) => a.status === "normal").length;
  const watch = analytes.filter((a) => a.status === "borderline").length;
  const flagged = analytes.filter((a) => a.status === "low" || a.status === "high").length;
  const unknown = analytes.filter((a) => a.status === "unknown").length;

  const rows = [
    { n: fine, label: fine === 1 ? "result within the range on your report" : "results within the ranges on your report", dot: "bg-accent", tone: "text-accent" },
    { n: watch, label: watch === 1 ? "result worth discussing" : "results worth discussing", dot: "bg-warn/70", tone: "text-warn" },
    { n: flagged, label: flagged === 1 ? "result outside the range" : "results outside the ranges", dot: "bg-warn", tone: "text-warn" },
    { n: unknown, label: unknown === 1 ? "result with no range printed" : "results with no range printed", dot: "bg-muted", tone: "text-muted" },
  ].filter((r) => r.n > 0);

  return (
    <div className="mt-6 rounded-lg border border-border bg-surface px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Your results at a glance
      </p>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline gap-3 text-[15px]">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${r.dot}`} aria-hidden="true" />
            <span>
              <span className={`font-medium ${r.tone}`}>{r.n}</span>{" "}
              <span className="text-muted">{r.label}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3.5 border-t border-border pt-3 text-xs leading-relaxed text-muted">
        Counted against the reference ranges printed on your own report — not against
        any range Lumen supplied.
      </p>
    </div>
  );
}

export default function LabExplainer() {
  const [level, setLevel] = useState<ExpertiseLevel>("some");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Explanation | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const canSubmit = (text.trim().length > 0 || file !== null) && !loading;

  async function submit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: Record<string, unknown> = { level };
      if (text.trim()) payload.text = text.trim();
      if (file) {
        if (file.size > MAX_BYTES) {
          setError("That file is larger than 8 MB. Try a smaller one, or paste the values instead.");
          setLoading(false);
          return;
        }
        payload.file = { mediaType: file.type, data: await fileToBase64(file), name: file.name };
      }

      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as Explanation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setText("");
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  if (result && result.isLabReport === false) {
    return (
      <div className="mt-10">
        <IrisSays>
          {result.notALabReportReason ||
            "I couldn't find any test results in what you sent me."}
        </IrisSays>
        <button
          onClick={reset}
          className="mt-7 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface"
        >
          Try something else
        </button>
      </div>
    );
  }

  if (result) {
    const urgency = URGENCY[result.urgency];
    return (
      <div className="mt-10">
        <IrisSays>{result.greeting}</IrisSays>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {result.documentType}
          {result.testedOn ? ` · ${result.testedOn}` : ""}
        </p>

        {result.reassurance && (
          <div className="mt-5 rounded-lg border border-accent-dim/60 bg-accent-dim/10 px-5 py-4">
            <p className="text-[13px] font-medium text-accent">First, the good news</p>
            <p className="mt-1.5 text-[15px] leading-relaxed">{result.reassurance}</p>
          </div>
        )}

        <p className="mt-6 text-[15px] leading-relaxed">{result.overview}</p>

        <div className="mt-6">
          <BottomLine
            label={urgency.label}
            tone={result.urgency === "routine" ? "good" : result.urgency === "seek_care_promptly" ? "danger" : "warn"}
          >
            {result.bottomLine}
          </BottomLine>
        </div>

        <Glance analytes={result.analytes} />

        <Collapsible title="Why I'm saying that">
          <p className="text-[15px] leading-relaxed text-muted">{result.urgencyReason}</p>
        </Collapsible>

        <Collapsible title="Every value on your report" count={result.analytes.length} defaultOpen>
          <ul className="space-y-3">
            {result.analytes.map((a, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium">{a.name}</p>
                  <span className="font-mono text-sm text-muted">
                    {a.value}
                    {a.unit ? ` ${a.unit}` : ""}
                  </span>
                </div>

                <p className="mt-1.5 flex items-center gap-2 text-sm">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[a.status] ?? STATUS_DOT.unknown}`}
                    aria-hidden="true"
                  />
                  <span className={a.status === "normal" ? "text-accent" : "text-warn"}>
                    {a.friendlyStatus}
                  </span>
                  {a.referenceRange && (
                    <span className="font-mono text-[11px] text-muted">
                      usual range {a.referenceRange}
                    </span>
                  )}
                </p>

                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{a.plainMeaning}</p>

                {a.analogy && (
                  <p className="mt-2.5 rounded-md bg-surface-2 px-3.5 py-2.5 text-[15px] leading-relaxed">
                    <span className="text-accent">Think of it like this — </span>
                    {a.analogy}
                  </p>
                )}

                {a.context && (
                  <p className="mt-2.5 border-l-2 border-border pl-3.5 text-[15px] leading-relaxed text-muted">
                    {a.context}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Collapsible>

        {result.notableFindings.length > 0 && (
          <Collapsible title="Worth understanding" count={result.notableFindings.length} tone="warn" defaultOpen={result.urgency !== "routine"}>
            <ul className="space-y-4">
              {result.notableFindings.map((f, i) => (
                <li key={i} className="border-l-2 border-accent-dim pl-4">
                  <p className="font-medium">{f.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{f.explanation}</p>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {result.whatThisDoesNotTellYou.length > 0 && (
          <Collapsible title="What this report can't tell you" count={result.whatThisDoesNotTellYou.length}>
            <ul className="space-y-2.5">
              {result.whatThisDoesNotTellYou.map((w, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span aria-hidden="true">·</span>
                  {w}
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        <Collapsible title="Questions to take to your doctor" count={result.questionsForYourDoctor.length}>
          <ol className="space-y-3">
            {result.questionsForYourDoctor.map((q, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="shrink-0 font-mono text-muted">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ol>
        </Collapsible>

        <div className="mt-10">
          <IrisSays>{result.closing}</IrisSays>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted">
          Iris explains what your report says. Iris does not diagnose you, cannot see the
          rest of your history, and is not a substitute for the clinician who ordered
          these tests.
        </div>

        <Feedback tool="labs" />

        <button
          onClick={reset}
          className="mt-8 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface"
        >
          Explain another report
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        Your results arrived
        <br />
        <span className="text-accent">before the explanation did.</span>
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
        Portals release results the moment they&apos;re ready, often days before anyone
        talks you through them. Paste yours below or upload the report, and Iris will
        walk you through every value — what it measures, what the flagged ones generally
        mean, and what to ask at your appointment.
      </p>

      <LevelPicker
        levels={LEVELS}
        copy={LEVEL_COPY}
        value={level}
        onChange={setLevel}
        legend="How much should Iris assume you know?"
      />

      <div className="mt-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          aria-label="Paste your lab results"
          placeholder={"Paste your results here — for example:\n\nHaemoglobin   10.2 g/dL   (12.0–15.5)\nFerritin       8 ng/mL    (15–150)\nMCV           74 fL       (80–100)"}
          className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm leading-relaxed outline-none placeholder:text-muted/60 focus:border-accent-dim"
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={fileInput}
            type="file"
            aria-label="Upload your lab report as a PDF or photo"
            accept={ACCEPT}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full max-w-xs text-sm text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:text-sm file:text-foreground hover:file:border-accent-dim"
          />
          {file && (
            <button
              onClick={() => {
                setFile(null);
                if (fileInput.current) fileInput.current.value = "";
              }}
              className="text-xs text-muted underline hover:text-foreground"
            >
              remove
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">
          PDF or a photo of the report, up to 8 MB. You can do both — paste the values and
          attach the file.
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          onClick={() => void submit()}
          disabled={!canSubmit}
          className="mt-6 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-40"
        >
          {loading ? "Iris is reading your report…" : "Explain my results"}
        </button>
      </div>

      <p className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        Iris does not diagnose and does not give medical advice, only explains what your
        report says so you can have a better conversation with your clinician. Your report
        is sent to Anthropic&apos;s API to be read and is not stored by Lumen.
      </p>
    </div>
  );
}

