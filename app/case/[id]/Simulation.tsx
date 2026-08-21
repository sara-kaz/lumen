"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PublicCase } from "@/lib/types";

type Msg = { role: "user" | "assistant"; content: string };

type OrderResult = {
  id: string;
  name: string;
  result: string;
  abnormal: boolean;
  costUsd: number;
  turnaroundMin: number;
};

type Debrief = {
  mentorNote: string;
  headline: string;
  overallScore: number;
  historyScore: number;
  investigationScore: number;
  reasoningScore: number;
  diagnosisVerdict: "correct" | "partial" | "incorrect";
  diagnosisComment: string;
  historyItems: { id: string; label: string; asked: boolean; comment: string }[];
  whatYouDidWell: string[];
  whatYouMissed: { title: string; consequence: string }[];
  overOrdered: { name: string; why: string }[];
  underOrdered: { name: string; why: string }[];
  managementFeedback: string;
  nextStep: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  lab: "Labs",
  imaging: "Imaging",
  ecg: "ECG",
  bedside: "Bedside",
};

export default function Simulation({ publicCase }: { publicCase: PublicCase }) {
  const [phase, setPhase] = useState<"history" | "commit" | "debrief">("history");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [pendingOrder, setPendingOrder] = useState<string | null>(null);
  const [differential, setDifferential] = useState("");
  const [plan, setPlan] = useState("");
  const [debrief, setDebrief] = useState<Debrief | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streaming]);

  const totalCost = orders.reduce((s, o) => s + o.costUsd, 0);
  const totalMinutes = orders.reduce((s, o) => s + o.turnaroundMin, 0);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: publicCase.id, messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");

      setMessages([...next, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setError("Couldn't reach the patient. Check your connection and try again.");
      setMessages(next);
    } finally {
      setStreaming(false);
    }
  }

  async function order(orderId: string) {
    if (orders.some((o) => o.id === orderId) || pendingOrder) return;
    setPendingOrder(orderId);
    setError(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: publicCase.id, orderId }),
      });
      if (!res.ok) throw new Error();
      const result: OrderResult = await res.json();
      setOrders((prev) => [...prev, result]);
    } catch {
      setError("That investigation didn't come back. Try again.");
    } finally {
      setPendingOrder(null);
    }
  }

  async function submitForGrading() {
    if (!differential.trim() || grading) return;
    setGrading(true);
    setError(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: publicCase.id,
          messages,
          orderedIds: orders.map((o) => o.id),
          differential,
          plan,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Grading failed");
      setDebrief(data);
      setPhase("debrief");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grading failed.");
    } finally {
      setGrading(false);
    }
  }

  if (phase === "debrief" && debrief) {
    return <DebriefView debrief={debrief} caseTitle={publicCase.title} />;
  }

  const grouped = Object.entries(
    publicCase.orderables.reduce<Record<string, typeof publicCase.orderables>>(
      (acc, o) => {
        (acc[o.category] ??= []).push(o);
        return acc;
      },
      {},
    ),
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:h-dvh lg:flex-none lg:overflow-hidden">
      <header className="mb-5 flex shrink-0 flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
        <div>
          <Link href="/cases" className="font-mono text-xs text-muted hover:text-accent">
            ← Cases
          </Link>
          <h1 className="mt-1 text-lg font-semibold">
            {publicCase.patient.name}, {publicCase.patient.age}
          </h1>
          <p className="text-sm text-muted">{publicCase.specialty}</p>
        </div>
        <div className="text-right font-mono text-xs text-muted">
          <div>
            Workup: <span className="text-foreground">${totalCost.toLocaleString()}</span>
          </div>
          <div>
            Elapsed: <span className="text-foreground">{totalMinutes} min</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      {phase === "history" ? (
        <div className="grid flex-1 gap-5 lg:min-h-0 lg:grid-cols-[1.35fr_1fr] lg:overflow-hidden">
          {/* ── History taking ───────────────────────────────── */}
          <section className="flex min-h-[28rem] flex-col overflow-hidden rounded-lg border border-border bg-surface lg:min-h-0">
            <div className="border-b border-border px-5 py-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Presenting complaint
              </p>
              <p className="mt-1 text-sm italic text-foreground">
                &ldquo;{publicCase.chiefComplaint}&rdquo;
              </p>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <p className="py-10 text-center text-sm text-muted">
                  The patient is in front of you. Start taking a history.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-accent-dim/40 text-foreground"
                        : "bg-surface-2 text-foreground"
                    }`}
                  >
                    {m.content ||
                      (streaming && i === messages.length - 1 ? (
                        <span className="text-muted">…</span>
                      ) : null)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  rows={2}
                  placeholder="Ask a question, or describe an examination…"
                  className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent-dim"
                />
                <button
                  onClick={() => void send()}
                  disabled={streaming || !input.trim()}
                  className="shrink-0 self-end rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity disabled:opacity-40"
                >
                  {streaming ? "…" : "Ask"}
                </button>
              </div>
            </div>
          </section>

          {/* ── Chart & orders ───────────────────────────────── */}
          <section className="flex flex-col gap-5 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
            <div className="rounded-lg border border-border bg-surface p-5">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Vitals on arrival
              </p>
              <dl className="grid grid-cols-2 gap-y-2 font-mono text-sm">
                {Object.entries(publicCase.patient.vitals).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted uppercase">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {orders.length > 0 && (
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Results
                </p>
                <ul className="space-y-3">
                  {orders.map((o) => (
                    <li key={o.id} className="text-sm">
                      <p
                        className={`font-medium ${o.abnormal ? "text-warn" : "text-foreground"}`}
                      >
                        {o.name}
                        {o.abnormal && (
                          <span className="ml-2 font-mono text-[10px] uppercase">
                            abnormal
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 leading-relaxed text-muted">{o.result}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg border border-border bg-surface p-5">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Order investigations
              </p>
              <div className="space-y-4">
                {grouped.map(([category, items]) => (
                  <div key={category}>
                    <p className="mb-1.5 text-[11px] font-medium text-muted">
                      {CATEGORY_LABEL[category] ?? category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((o) => {
                        const done = orders.some((x) => x.id === o.id);
                        return (
                          <button
                            key={o.id}
                            onClick={() => void order(o.id)}
                            disabled={done || pendingOrder !== null}
                            title={`$${o.costUsd} · ${o.turnaroundMin} min`}
                            aria-label={`${o.name} — $${o.costUsd}, ${o.turnaroundMin} minutes`}
                            className={`rounded border px-2.5 py-1 text-xs transition-colors ${
                              done
                                ? "cursor-default border-accent-dim bg-accent-dim/20 text-muted"
                                : "border-border hover:border-accent-dim hover:bg-surface-2"
                            } disabled:opacity-60`}
                          >
                            {pendingOrder === o.id ? "…" : o.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase("commit")}
              disabled={messages.length === 0}
              className="rounded-md border border-accent px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              Commit to a diagnosis →
            </button>
          </section>
        </div>
      ) : (
        /* ── Commit ─────────────────────────────────────────── */
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="text-xl font-semibold">Commit to your answer</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            You asked {messages.filter((m) => m.role === "user").length} question
            {messages.filter((m) => m.role === "user").length === 1 ? "" : "s"} and
            ordered {orders.length} investigation{orders.length === 1 ? "" : "s"}. You
            can&apos;t go back after this.
          </p>

          <label className="mt-7 block">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Differential diagnosis
            </span>
            <textarea
              value={differential}
              onChange={(e) => setDifferential(e.target.value)}
              rows={5}
              autoFocus
              placeholder="Leading diagnosis first, then what else you're keeping on the list and why."
              className="mt-2 w-full resize-none rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent-dim"
            />
          </label>

          <label className="mt-5 block">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Management plan
            </span>
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={5}
              placeholder="What do you do for this patient now, and where do they go next?"
              className="mt-2 w-full resize-none rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent-dim"
            />
          </label>

          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={() => void submitForGrading()}
              disabled={!differential.trim() || grading}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:opacity-40"
            >
              {grading ? "Grading your reasoning…" : "Submit for review"}
            </button>
            <button
              onClick={() => setPhase("history")}
              disabled={grading}
              className="text-sm text-muted hover:text-foreground disabled:opacity-40"
            >
              Back to the patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Debrief ──────────────────────────────────────────────── */

function scoreColor(n: number) {
  if (n >= 75) return "text-accent";
  if (n >= 50) return "text-warn";
  return "text-danger";
}

function ScoreTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className={`mt-1 font-mono text-2xl ${scoreColor(value)}`}>{value}</p>
    </div>
  );
}

function EllisSays({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-dim bg-surface font-mono text-sm text-accent">
        E
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-accent">Dr. Ellis</p>
        <p className="mt-1 text-[15px] leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function DebriefView({
  debrief,
  caseTitle,
}: {
  debrief: Debrief;
  caseTitle: string;
}) {
  const verdictStyle = {
    correct: "border-accent text-accent",
    partial: "border-warn text-warn",
    incorrect: "border-danger text-danger",
  }[debrief.diagnosisVerdict];

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link href="/cases" className="font-mono text-xs text-muted hover:text-accent">
        ← Cases
      </Link>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        Debrief · {caseTitle}
      </p>

      <div className="mt-5">
        <EllisSays>{debrief.mentorNote}</EllisSays>
      </div>

      <h1 className="mt-8 text-2xl font-semibold leading-snug">{debrief.headline}</h1>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ScoreTile label="Overall" value={debrief.overallScore} />
        <ScoreTile label="History" value={debrief.historyScore} />
        <ScoreTile label="Workup" value={debrief.investigationScore} />
        <ScoreTile label="Reasoning" value={debrief.reasoningScore} />
      </div>

      <section className="mt-8">
        <div className={`rounded-lg border bg-surface px-5 py-4 ${verdictStyle}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
            Diagnosis — {debrief.diagnosisVerdict}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {debrief.diagnosisComment}
          </p>
        </div>
      </section>

      <Section title="Your history">
        <ul className="space-y-2.5">
          {debrief.historyItems.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <span
                className={`mt-0.5 shrink-0 font-mono ${
                  item.asked ? "text-accent" : "text-danger"
                }`}
              >
                {item.asked ? "✓" : "✕"}
              </span>
              <div>
                <p className={item.asked ? "text-foreground" : "text-foreground"}>
                  {item.label}
                </p>
                <p className="mt-0.5 leading-relaxed text-muted">{item.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {debrief.whatYouDidWell.length > 0 && (
        <Section title="What you did well">
          <ul className="space-y-2.5">
            {debrief.whatYouDidWell.map((w, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 shrink-0 font-mono text-accent">+</span>
                {w}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {debrief.whatYouMissed.length > 0 && (
        <Section title="What you missed">
          <ul className="space-y-3">
            {debrief.whatYouMissed.map((m, i) => (
              <li key={i} className="border-l-2 border-danger pl-4 text-sm">
                <p className="font-medium">{m.title}</p>
                <p className="mt-1 leading-relaxed text-muted">{m.consequence}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(debrief.underOrdered.length > 0 || debrief.overOrdered.length > 0) && (
        <Section title="Your workup">
          <div className="space-y-4 text-sm">
            {debrief.underOrdered.map((o, i) => (
              <div key={`u${i}`}>
                <p className="text-warn">Should have ordered — {o.name}</p>
                <p className="mt-0.5 leading-relaxed text-muted">{o.why}</p>
              </div>
            ))}
            {debrief.overOrdered.map((o, i) => (
              <div key={`o${i}`}>
                <p className="text-warn">Not indicated — {o.name}</p>
                <p className="mt-0.5 leading-relaxed text-muted">{o.why}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Management">
        <p className="text-sm leading-relaxed text-muted">
          {debrief.managementFeedback}
        </p>
      </Section>

      <div className="mt-8 rounded-lg border border-accent-dim bg-accent-dim/10 px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Work on this next
        </p>
        <p className="mt-2 text-sm leading-relaxed">{debrief.nextStep}</p>
      </div>

      <Link
        href="/cases"
        className="mt-8 inline-block rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface"
      >
        Another case →
      </Link>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}
