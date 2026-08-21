/**
 * Progressive disclosure for long clinical output.
 *
 * Built on native <details>/<summary>: keyboard accessible, announced correctly by
 * screen readers, and works with JavaScript disabled — none of which is true of a
 * hand-rolled toggle.
 *
 * NOTE: never wrap safety-critical content in this. An emergency instruction or a
 * return precaution behind a closed disclosure is an instruction the person does not
 * read. Those stay open on the page.
 */
export function Collapsible({
  title,
  count,
  tone = "default",
  defaultOpen = false,
  children,
}: {
  title: string;
  /** Shown beside the title so people can judge whether it's worth opening. */
  count?: number;
  tone?: "default" | "warn";
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className={`group mt-2.5 overflow-hidden rounded-lg border bg-surface ${
        tone === "warn" ? "border-warn/40" : "border-border"
      }`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
        <span className="flex items-baseline gap-2.5">
          <span className={`text-[15px] font-medium ${tone === "warn" ? "text-warn" : ""}`}>
            {title}
          </span>
          {count !== undefined && count > 0 && (
            <span className="font-mono text-[11px] text-muted">{count}</span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-xs text-muted transition-transform group-open:rotate-90"
        >
          ›
        </span>
      </summary>
      <div className="border-t border-border px-5 py-4">{children}</div>
    </details>
  );
}

/**
 * The single verdict card. Carries the headline decision AND the one-or-two-sentence
 * takeaway together — separating them produced two stacked blocks saying the same
 * thing, which is exactly what a "short version" is supposed to prevent.
 */
export function BottomLine({
  children,
  label,
  sub,
  tone = "default",
}: {
  children: React.ReactNode;
  /** The decision itself, e.g. "Go to an emergency department now". */
  label?: string;
  sub?: string;
  tone?: "default" | "warn" | "danger" | "good";
}) {
  const border = {
    default: "border-border",
    good: "border-accent-dim",
    warn: "border-warn/60",
    danger: "border-danger",
  }[tone];
  const bg = {
    default: "bg-surface",
    good: "bg-accent-dim/10",
    warn: "bg-warn/10",
    danger: "bg-danger/10",
  }[tone];

  const accent = {
    default: "text-foreground",
    good: "text-accent",
    warn: "text-warn",
    danger: "text-danger",
  }[tone];

  return (
    <div className={`rounded-lg border-2 px-5 py-5 ${border} ${bg}`}>
      {label ? (
        <>
          <p className={`text-lg font-medium leading-snug ${accent}`}>{label}</p>
          {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
          <p className="mt-3 text-[15px] leading-relaxed">{children}</p>
        </>
      ) : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            The short version
          </p>
          <p className="mt-2 text-lg leading-snug">{children}</p>
        </>
      )}
    </div>
  );
}
