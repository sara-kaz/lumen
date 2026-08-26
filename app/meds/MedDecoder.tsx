"use client";

import { useRef, useState } from "react";
import { IrisSays, LevelPicker } from "@/components/Iris";
import { BottomLine, Collapsible } from "@/components/Collapsible";
import { Feedback } from "@/components/Feedback";
import { LEVEL_COPY, LEVELS, type ExpertiseLevel } from "@/lib/explain";
import type { Identification, MedsExplanation } from "@/lib/meds";

const MAX_BYTES = 8 * 1024 * 1024;

type Source = {
  input: string;
  resolved: string | null;
  matchType: string;
  labelFound: boolean;
  hasInteractionSection: boolean;
};
type Result = MedsExplanation & { sources: Source[] };

const URGENCY: Record<MedsExplanation["urgency"], { label: string; className: string }> = {
  routine: {
    label: "Nothing here stands out",
    className: "border-accent-dim bg-accent-dim/10",
  },
  ask_soon: {
    label: "Worth raising at your next opportunity",
    className: "border-warn/60 bg-warn/10",
  },
  ask_promptly: {
    label: "Worth asking a pharmacist today",
    className: "border-danger bg-danger/10",
  },
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const r = String(reader.result);
      resolve(r.slice(r.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });
}

export default function MedDecoder() {
  const [level, setLevel] = useState<ExpertiseLevel>("some");
  const [phase, setPhase] = useState<"input" | "confirm" | "result">("input");
  const [typed, setTyped] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [identifyNote, setIdentifyNote] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<null | "reading" | "checking">(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function parseTyped(): string[] {
    return typed
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const MAX_PHOTOS = 6;

  function addPhotos(list: FileList) {
    const incoming = Array.from(list).filter((f) => f.size <= MAX_BYTES);
    if (incoming.length < list.length) {
      setError("Some photos were over 8 MB and were skipped.");
    }
    setPhotos((prev) => [...prev, ...incoming].slice(0, MAX_PHOTOS));
  }

  async function readPhotos() {
    if (photos.length === 0 || loading) return;
    setLoading("reading");
    setError(null);
    setIdentifyNote(null);
    try {
      const files = await Promise.all(
        photos.map(async (f) => ({ mediaType: f.type, data: await fileToBase64(f) })),
      );
      const res = await fetch("/api/meds/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      const data: Identification & { error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't read that image.");

      if (!data.isMedication || data.medications.length === 0) {
        setIdentifyNote(
          data.notMedicationReason ||
            `I couldn't find a medication name in ${photos.length === 1 ? "that photo" : "those photos"}.`,
        );
        setLoading(null);
        return;
      }

      const unclear = data.medications.filter((m) => !m.readable);
      if (unclear.length > 0) {
        setIdentifyNote(
          `Some of this was hard to read — please check it: ${unclear
            .map((m) => m.note || m.name)
            .join("; ")}`,
        );
      }
      // Always confirm what came off a photo. A misread name must never flow
      // straight into an interaction check.
      setNames(data.medications.map((m) => m.name));
      setPhase("confirm");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read that image.");
    } finally {
      setLoading(null);
    }
  }

  async function explain(list: string[]) {
    if (list.length === 0) return;
    setLoading("checking");
    setError(null);
    try {
      const res = await fetch("/api/meds/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, names: list }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as Result);
      setPhase("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  function reset() {
    setPhase("input");
    setTyped("");
    setPhotos([]);
    setNames([]);
    setResult(null);
    setError(null);
    setIdentifyNote(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  /* ── Result ──────────────────────────────────────────────── */
  if (phase === "result" && result) {
    const urgency = URGENCY[result.urgency];
    return (
      <div className="mt-10">
        <IrisSays>{result.greeting}</IrisSays>

        <div className="mt-7">
          <BottomLine
            label={urgency.label}
            tone={result.urgency === "routine" ? "good" : result.urgency === "ask_promptly" ? "danger" : "warn"}
          >
            {result.bottomLine}
          </BottomLine>
        </div>

        <Collapsible title="Why I'm saying that">
          <p className="text-[15px] leading-relaxed text-muted">{result.urgencyReason}</p>
        </Collapsible>

        <Collapsible title="What each one is for" count={result.medications.length} defaultOpen>
          <ul className="space-y-3">
            {result.medications.map((m, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface px-5 py-4">
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <p className="font-medium">{m.name}</p>
                  {m.asEntered && m.asEntered.toLowerCase() !== m.name.toLowerCase() && (
                    <span className="font-mono text-[11px] text-muted">you entered “{m.asEntered}”</span>
                  )}
                  {!m.recognised && (
                    <span className="rounded border border-warn/50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-warn">
                      not found
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[15px] leading-relaxed">{m.whatItIsFor}</p>
                {m.goodToKnow && (
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{m.goodToKnow}</p>
                )}
              </li>
            ))}
          </ul>
        </Collapsible>

        {result.overlappingEffects.length > 0 && (
          <Collapsible title="Effects that stack up" count={result.overlappingEffects.length} tone="warn" defaultOpen={result.urgency !== "routine"}>
            <ul className="space-y-4">
              {result.overlappingEffects.map((o, i) => (
                <li key={i} className="border-l-2 border-warn/60 pl-4">
                  <p className="font-medium">{o.effect}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    {o.contributors.join(" + ")}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{o.why}</p>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {result.interactionFindings.length > 0 && (
          <Collapsible title="What the official labelling says" count={result.interactionFindings.length}>
            <ul className="space-y-4">
              {result.interactionFindings.map((f, i) => (
                <li key={i} className="rounded-lg border border-border bg-surface px-5 py-4">
                  <p className="font-medium">{f.headline}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    {f.involves.join(" + ")}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.whatHappens}</p>
                  <blockquote className="mt-3 border-l-2 border-accent-dim bg-surface-2 px-3.5 py-2.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                      Why Lumen flagged this
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">“{f.sourceQuote}”</p>
                    <cite className="mt-1.5 block font-mono text-[10px] not-italic text-muted">
                      — FDA label, {f.sourceDrug}
                    </cite>
                  </blockquote>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {result.notCovered.length > 0 && (
          <Collapsible title="What I couldn't check" count={result.notCovered.length}>
            <ul className="space-y-2.5">
              {result.notCovered.map((n, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span aria-hidden="true">·</span>
                  {n}
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        <Collapsible title="Questions for your pharmacist" count={result.questionsForPharmacist.length}>
          <ol className="space-y-3">
            {result.questionsForPharmacist.map((q, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="shrink-0 font-mono text-muted">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ol>
        </Collapsible>

        <Collapsible title="Where this came from" count={result.sources.length}>
          <ul className="space-y-1.5">
            {result.sources.map((s, i) => (
              <li key={i} className="flex flex-wrap gap-x-2 font-mono text-[11px] text-muted">
                <span className="text-foreground">{s.input}</span>
                <span>·</span>
                <span>{s.labelFound ? "FDA label found" : "no FDA label"}</span>
                <span>·</span>
                <span>
                  {s.hasInteractionSection ? "interactions section present" : "no interactions section"}
                </span>
              </li>
            ))}
          </ul>
        </Collapsible>

        <div className="mt-10">
          <IrisSays>{result.closing}</IrisSays>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted">
          This reads the official FDA label for each medicine you listed. It is not a
          complete interaction check — no such check exists from labelling alone, and
          nothing here accounts for your dose, your other conditions, or your history.
          Iris never tells you to start, stop or change a medication. Your pharmacist can
          see the whole picture; Iris cannot.
        </div>

        <Feedback tool="meds" />

        <button
          onClick={reset}
          className="mt-8 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface"
        >
          Check a different list
        </button>
      </div>
    );
  }

  /* ── Confirm what came off the photo ─────────────────────── */
  if (phase === "confirm") {
    return (
      <div className="mt-10">
        <h1 className="text-2xl font-semibold">Is this right?</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          I read these off your photo. Please check them before I look anything up — a
          misread name would make everything after it wrong.
        </p>

        {identifyNote && (
          <div className="mt-5 rounded-md border border-warn/50 bg-warn/10 px-4 py-3 text-sm leading-relaxed text-warn">
            {identifyNote}
          </div>
        )}

        <ul className="mt-6 space-y-2.5">
          {names.map((n, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                value={n}
                aria-label={`Medication ${i + 1}`}
                onChange={(e) =>
                  setNames(names.map((x, j) => (j === i ? e.target.value : x)))
                }
                className="flex-1 rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent-dim"
              />
              <button
                onClick={() => setNames(names.filter((_, j) => j !== i))}
                aria-label={`Remove ${n}`}
                className="rounded-md border border-border px-3 py-2.5 text-xs text-muted transition-colors hover:border-danger hover:text-danger"
              >
                remove
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setNames([...names, ""])}
          className="mt-3 text-sm text-accent hover:underline"
        >
          + add another
        </button>

        {error && (
          <div className="mt-5 rounded-md border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => void explain(names.map((n) => n.trim()).filter(Boolean))}
            disabled={loading !== null || names.filter((n) => n.trim()).length === 0}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-40"
          >
            {loading === "checking" ? "Looking up the labelling…" : "That's right — check these"}
          </button>
          <button onClick={reset} disabled={loading !== null} className="text-sm text-muted hover:text-foreground disabled:opacity-40">
            Start over
          </button>
        </div>
      </div>
    );
  }

  /* ── Input ───────────────────────────────────────────────── */
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        Nobody ever explains
        <br />
        <span className="text-accent">what you&apos;re actually taking.</span>
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
        Photograph your medicine boxes, or type the names in. I&apos;ll tell you what each
        one is for, and — the part that matters — which combinations are worth asking a
        pharmacist about. Everything comes from official FDA labelling, quoted so you can
        see exactly where it came from.
      </p>

      <LevelPicker
        levels={LEVELS}
        copy={LEVEL_COPY}
        value={level}
        onChange={setLevel}
        legend="How much should Iris assume you know?"
      />

      <div className="mt-8">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Type your medicines — one per line
          </span>
          <textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            rows={6}
            aria-label="Type your medicines, one per line"
            placeholder={"oxybutynin\ndiphenhydramine\namlodipine\natorvastatin"}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm leading-relaxed outline-none placeholder:text-muted/60 focus:border-accent-dim"
          />
        </label>

        <div className="mt-5 border-t border-border pt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Or photograph the boxes
          </p>
          <p className="mt-1.5 text-sm text-muted">
            Add up to {MAX_PHOTOS} photos — one box at a time is fine, and they&apos;re all
            read together.
          </p>

          {photos.length > 0 && (
            <ul className="mt-3 space-y-2">
              {photos.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3.5 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm">{f.name}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted">
                    {(f.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                  <button
                    onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                    aria-label={`Remove ${f.name}`}
                    className="shrink-0 text-xs text-muted underline hover:text-danger"
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <input
            ref={fileInput}
            type="file"
            multiple
            aria-label="Photograph your medication packaging"
            accept=".png,.jpg,.jpeg,.webp,.gif"
            onChange={(e) => {
              if (e.target.files?.length) addPhotos(e.target.files);
              // Reset so the same file can be picked again after removing it.
              e.target.value = "";
            }}
            disabled={photos.length >= MAX_PHOTOS}
            className="mt-3 block w-full max-w-xs text-sm text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-surface file:px-3 file:py-1.5 file:text-sm file:text-foreground hover:file:border-accent-dim disabled:opacity-40"
          />

          {photos.length >= MAX_PHOTOS && (
            <p className="mt-2 text-xs text-warn">
              That&apos;s the maximum. Remove one to add another.
            </p>
          )}

          {photos.length > 0 && (
            <button
              onClick={() => void readPhotos()}
              disabled={loading !== null}
              className="mt-4 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-40"
            >
              {loading === "reading"
                ? "Reading your photos…"
                : `Read ${photos.length} photo${photos.length === 1 ? "" : "s"}`}
            </button>
          )}

          <p className="mt-3 text-xs text-muted">
            You&apos;ll get to check what I read before anything is looked up.
          </p>
        </div>

        {identifyNote && (
          <div className="mt-5 rounded-md border border-warn/50 bg-warn/10 px-4 py-3 text-sm leading-relaxed text-warn">
            {identifyNote}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-md border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          onClick={() => void explain(parseTyped())}
          disabled={loading !== null || parseTyped().length === 0}
          className="mt-7 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-40"
        >
          {loading === "reading"
            ? "Reading your photo…"
            : loading === "checking"
              ? "Looking up the labelling…"
              : "Explain my medicines"}
        </button>
      </div>

      <p className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        Iris never tells you to start, stop or change a medication — that is your
        prescriber&apos;s decision. This reads official FDA labelling and is not a complete
        interaction check. Your pharmacist can see your full history; Iris cannot.
      </p>
    </div>
  );
}
