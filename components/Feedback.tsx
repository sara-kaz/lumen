"use client";

import { useState } from "react";

type Tool = "meds" | "labs" | "care" | "cases" | "other";

/**
 * Deliberately a single question first. "Was this helpful?" gets answered by people
 * who would never open a feedback form, and the free-text box only appears after
 * they have already committed to one click.
 */
export function Feedback({ tool }: { tool: Tool }) {
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  async function send(value: "yes" | "no", withDetail = false) {
    setHelpful(value);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helpful: value,
          tool,
          message: withDetail ? message.trim() || undefined : undefined,
          contact: withDetail ? contact.trim() || undefined : undefined,
        }),
      });
    } catch {
      /* feedback failing must never interrupt the person using the tool */
    }
    if (withDetail) setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-10 rounded-xl border border-accent-dim bg-accent-dim/10 px-5 py-4">
        <p className="text-[15px]">Thank you — that genuinely helps.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-xl border border-border bg-surface px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-[15px] font-medium">Was this helpful?</p>
        <div className="flex gap-2">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              onClick={() => void send(v)}
              aria-pressed={helpful === v}
              className={`rounded-md border px-3.5 py-1.5 text-sm transition-colors ${
                helpful === v
                  ? "border-accent bg-accent-dim/20 text-accent"
                  : "border-border hover:border-accent-dim hover:bg-surface-2"
              }`}
            >
              {v === "yes" ? "Yes" : "Not really"}
            </button>
          ))}
        </div>
      </div>

      {helpful && (
        <div className="mt-4 border-t border-border pt-4">
          <label className="block">
            <span className="text-sm text-muted">
              {helpful === "yes"
                ? "Anything that would have made it better?"
                : "What did it get wrong or miss?"}
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              aria-label="Your feedback"
              className="mt-2 w-full resize-y rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent-dim"
            />
          </label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            aria-label="Email, if you'd like a reply (optional)"
            placeholder="Email, if you'd like a reply (optional)"
            className="mt-2.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-accent-dim"
          />
          <button
            onClick={() => void send(helpful, true)}
            className="mt-3 rounded-md bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
