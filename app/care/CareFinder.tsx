"use client";

import { useState } from "react";
import { IrisSays, Section } from "@/components/Iris";
import { BottomLine, Collapsible } from "@/components/Collapsible";
import type { Triage } from "@/lib/triage";
import type { Place } from "@/lib/places";

type Result = Triage & { places: Place[]; locationUsed: boolean };

const DISPOSITION: Record<
  Triage["disposition"],
  { label: string; sub: string; className: string }
> = {
  emergency_now: {
    label: "Go to an emergency department now",
    sub: "Or call your local emergency number.",
    className: "border-danger bg-danger/10",
  },
  urgent_today: {
    label: "You should be seen today",
    sub: "Urgent care, or a same-day appointment.",
    className: "border-warn bg-warn/10",
  },
  routine_days: {
    label: "Worth an appointment in the next few days",
    sub: "Not an emergency, but don't leave it.",
    className: "border-warn/50 bg-warn/5",
  },
  self_care: {
    label: "Reasonable to manage at home for now",
    sub: "Check the list below — it tells you when that changes.",
    className: "border-accent-dim bg-accent-dim/10",
  },
};

const CARE_LABEL: Record<string, string> = {
  emergency_department: "Nearest emergency departments",
  urgent_care: "Nearest walk-in and urgent care",
  primary_care: "Nearest doctors' surgeries",
  pharmacy: "Nearest pharmacies",
};

export default function CareFinder() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [context, setContext] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [placeLabel, setPlaceLabel] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoOptions, setGeoOptions] = useState<{ lat: number; lon: number; displayName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocError("Your browser can't share a location. You'll still get everything else.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setPlaceLabel("your current location");
        setLocating(false);
      },
      (err) => {
        // Once permission is denied the browser will not prompt again, so a generic
        // "couldn't get your location" leaves people clicking a button that can't work.
        if (err.code === err.PERMISSION_DENIED) {
          setLocError(
            "Location is blocked for this site in your browser. You can unblock it in your browser's site settings — or just type where you are below.",
          );
        } else if (err.code === err.TIMEOUT) {
          setLocError("That took too long. Type where you are instead — it works just as well.");
        } else {
          setLocError("Your device couldn't provide a location. Type where you are instead.");
        }
        setManualOpen(true);
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  }

  async function lookupPlace() {
    const q = manualQuery.trim();
    if (q.length < 2 || geocoding) return;
    setGeocoding(true);
    setLocError(null);
    setGeoOptions([]);
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't find that place.");
      setGeoOptions(data.results);
    } catch (e) {
      setLocError(e instanceof Error ? e.message : "Couldn't find that place.");
    } finally {
      setGeocoding(false);
    }
  }

  function clearLocation() {
    setCoords(null);
    setPlaceLabel(null);
    setGeoOptions([]);
    setManualQuery("");
  }

  async function submit() {
    if (symptoms.trim().length < 3 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          age: age.trim() || undefined,
          context: context.trim() || undefined,
          coords: coords ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const d = DISPOSITION[result.disposition];
    return (
      <div className="mt-8">
        {/* Rendered first, before anything else can distract from it. */}
        {result.emergencyOverride && (
          <div className="rounded-lg border-2 border-danger bg-danger/15 px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-danger">
              This needs emergency care now
            </p>
            <p className="mt-2.5 text-lg font-medium leading-snug">{result.emergencyReason}</p>
            <p className="mt-3 text-[15px] leading-relaxed">
              Call your local emergency number — <strong>911</strong> in the US and Canada,{" "}
              <strong>999</strong> or <strong>112</strong> in the UK and Europe. If someone can
              drive you immediately, that can be faster than waiting. Do not drive yourself.
            </p>
          </div>
        )}

        {result.crisisSupport ? (
          <div className="mt-6 rounded-lg border-2 border-accent bg-accent-dim/15 px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              Please talk to someone tonight
            </p>
            <p className="mt-2.5 text-[15px] leading-relaxed">{result.greeting}</p>
            <ul className="mt-4 space-y-2 text-[15px] leading-relaxed">
              <li>
                <strong>US &amp; Canada</strong> — call or text <strong>988</strong>
              </li>
              <li>
                <strong>UK &amp; Ireland</strong> — Samaritans, <strong>116 123</strong>, free, any time
              </li>
              <li>
                <strong>Anywhere else</strong> —{" "}
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  findahelpline.com
                </a>
              </li>
            </ul>
          </div>
        ) : result.emergencyOverride ? null : (
          <div className="mt-6">
            <IrisSays>{result.greeting}</IrisSays>
          </div>
        )}

        <div className="mt-6">
          <BottomLine
            label={d.label}
            sub={d.sub}
            tone={
              result.disposition === "emergency_now"
                ? "danger"
                : result.disposition === "self_care"
                  ? "good"
                  : "warn"
            }
          >
            {result.bottomLine}
          </BottomLine>
        </div>

        <Collapsible title="Why I'm saying that">
          <p className="text-[15px] leading-relaxed text-muted">{result.dispositionReason}</p>
        </Collapsible>

        {result.places.length > 0 && (
          <Collapsible title={CARE_LABEL[result.careType] ?? "Nearby care"} count={result.places.length} defaultOpen={result.disposition === "emergency_now" || result.disposition === "urgent_today"}>
            <ul className="space-y-2.5">
              {result.places.map((p, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {p.name}
                      {p.hasEmergency && (
                        <span className="ml-2 rounded border border-danger/50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-danger">
                          ER
                        </span>
                      )}
                    </p>
                    {p.address && <p className="mt-0.5 text-sm text-muted">{p.address}</p>}
                    {p.openingHours && (
                      <p className="mt-0.5 font-mono text-[11px] text-muted">{p.openingHours}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-baseline gap-3">
                    <span className="font-mono text-sm text-muted">
                      {p.distanceKm < 1
                        ? `${Math.round(p.distanceKm * 1000)} m`
                        : `${p.distanceKm.toFixed(1)} km`}
                    </span>
                    <a
                      href={p.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      map →
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              From OpenStreetMap. Distances are straight-line, not driving. Call ahead where
              you can — opening hours change and this data is community-maintained.
            </p>
          </Collapsible>
        )}

        {result.whatToWatchFor.length > 0 && (
          <Section title="What would change this answer">
            <ul className="space-y-2.5 rounded-lg border border-warn/40 bg-warn/5 px-5 py-4">
              {result.whatToWatchFor.map((w, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="shrink-0 text-warn" aria-hidden="true">
                    !
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {result.whatToDoNow.length > 0 && (
          <Collapsible title="What to do now" count={result.whatToDoNow.length}>
            <ul className="space-y-2.5">
              {result.whatToDoNow.map((w, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="shrink-0 text-accent" aria-hidden="true">
                    →
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {result.redFlags.length > 0 && (
          <Collapsible title="What raised the urgency" count={result.redFlags.length} tone="warn">
            <ul className="space-y-3">
              {result.redFlags.map((r, i) => (
                <li key={i} className="border-l-2 border-warn pl-4">
                  <p className="text-[15px] font-medium">{r.symptom}</p>
                  <p className="mt-0.5 text-[15px] leading-relaxed text-muted">{r.why}</p>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {result.reassuring.length > 0 && (
          <Collapsible title="What's reassuring" count={result.reassuring.length}>
            <ul className="space-y-2">
              {result.reassuring.map((r, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span className="shrink-0 text-accent" aria-hidden="true">
                    ·
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {result.whatToTell.length > 0 && (
          <Collapsible title="What to tell whoever sees you" count={result.whatToTell.length}>
            <ol className="space-y-2.5">
              {result.whatToTell.map((w, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="shrink-0 font-mono text-muted">{i + 1}.</span>
                  {w}
                </li>
              ))}
            </ol>
          </Collapsible>
        )}

        {result.commonCauses.length > 0 && (
          <Collapsible title="For orientation only — not about you" count={result.commonCauses.length}>
            <p className="mb-3 text-sm leading-relaxed text-muted">
              These are broad categories that commonly cause symptoms like the ones you
              described, in general. They are not a judgement about what you have — I
              can&apos;t examine you, and only a clinician can tell these apart.
            </p>
            <ul className="space-y-2.5">
              {result.commonCauses.map((c, i) => (
                <li key={i} className="text-[15px] leading-relaxed">
                  <span className="font-medium">{c.category}</span>
                  <span className="text-muted"> — {c.note}</span>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {!result.crisisSupport && (
          <div className="mt-10">
            <IrisSays>{result.closing}</IrisSays>
          </div>
        )}

        <div className="mt-8 rounded-lg border border-border bg-surface px-5 py-4 text-xs leading-relaxed text-muted">
          Iris helps you decide how urgently to be seen and where to go. Iris does not
          diagnose you, cannot examine you, and never recommends medication. If you feel
          worse or something changes, act on that rather than on this page.
        </div>

        <button
          onClick={() => setResult(null)}
          className="mt-8 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface"
        >
          Start again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        It&apos;s 11pm and you don&apos;t know
        <br />
        <span className="text-accent">if this can wait.</span>
      </h1>
      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
        Tell me what&apos;s going on. I&apos;ll help you work out how urgently you should
        seek care, exactly what would change that answer, and where the nearest place
        that can help actually is. I won&apos;t tell you what you have — I can&apos;t examine you, and
        guessing is how people talk themselves out of care they need.
      </p>

      <div className="mt-8 rounded-lg border border-danger/40 bg-danger/5 px-5 py-3.5 text-sm leading-relaxed">
        If someone is unconscious, struggling to breathe, bleeding heavily, or you think
        this is a heart attack or stroke — <strong>call your emergency number now</strong>{" "}
        rather than typing here.
      </div>

      <label className="mt-8 block">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          What&apos;s going on?
        </span>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={5}
          aria-label="Describe your symptoms"
          placeholder="Describe it the way you'd tell a friend — what it feels like, when it started, and whether anything makes it better or worse."
          className="mt-2 w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-[15px] leading-relaxed outline-none placeholder:text-muted/60 focus:border-accent-dim"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-[8rem_1fr]">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Age</span>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            inputMode="numeric"
            aria-label="Your age"
            placeholder="34"
            className="mt-2 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent-dim"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Anything else worth knowing? <span className="normal-case">(optional)</span>
          </span>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            aria-label="Other relevant context"
            placeholder="Pregnant, diabetic, on blood thinners, recent surgery…"
            className="mt-2 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent-dim"
          />
        </label>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface px-5 py-4">
        <p className="text-sm font-medium">Find places near me</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Optional. Used once to look up nearby care and never stored. Everything else
          works without it.
        </p>

        {coords ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-accent-dim bg-accent-dim/15 px-3 py-1.5 text-sm text-accent">
              Using {placeLabel ?? "your location"}
            </span>
            <button onClick={clearLocation} className="text-xs text-muted underline hover:text-foreground">
              change
            </button>
          </div>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={useMyLocation}
                disabled={locating}
                className="rounded-md border border-border px-3.5 py-2 text-sm transition-colors hover:border-accent-dim hover:bg-surface-2 disabled:opacity-40"
              >
                {locating ? "Finding you…" : "Use my location"}
              </button>
              <button
                onClick={() => setManualOpen((v) => !v)}
                className="text-sm text-accent hover:underline"
              >
                {manualOpen ? "hide" : "or type where you are"}
              </button>
            </div>

            {locError && <p className="mt-2.5 text-sm leading-relaxed text-warn">{locError}</p>}

            {manualOpen && (
              <div className="mt-4 border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">
                  <input
                    value={manualQuery}
                    onChange={(e) => setManualQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void lookupPlace();
                      }
                    }}
                    aria-label="Town, city or postcode"
                    placeholder="Dearborn, Michigan"
                    className="min-w-0 flex-1 rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent-dim"
                  />
                  <button
                    onClick={() => void lookupPlace()}
                    disabled={geocoding || manualQuery.trim().length < 2}
                    className="rounded-md border border-border px-3.5 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface-2 disabled:opacity-40"
                  >
                    {geocoding ? "Looking…" : "Find"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  Include the country if you use a postcode — a bare one can match
                  somewhere else entirely.
                </p>

                {geoOptions.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {geoOptions.map((o, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            setCoords({ lat: o.lat, lon: o.lon });
                            setPlaceLabel(o.displayName.split(",").slice(0, 2).join(","));
                            setGeoOptions([]);
                          }}
                          className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-left text-sm transition-colors hover:border-accent-dim hover:bg-surface-2"
                        >
                          {o.displayName}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mt-5 rounded-md border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {error}
        </div>
      )}

      <button
        onClick={() => void submit()}
        disabled={symptoms.trim().length < 3 || loading}
        className="mt-7 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-40"
      >
        {loading ? "Thinking it through…" : "Where should I go?"}
      </button>

      <p className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        Lumen does not diagnose and is not a substitute for medical care. It helps you
        judge urgency and find where to go. When in doubt, be seen.
      </p>
    </div>
  );
}
