import { LumenMark } from "./LumenMark";

/** Iris speaking. Used for greetings and sign-offs only — never for body content. */
export function IrisSays({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-dim bg-surface text-accent">
        <LumenMark size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-accent">Iris</p>
        <p className="mt-1 text-[15px] leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LevelPicker<T extends string>({
  levels,
  copy,
  value,
  onChange,
  legend,
}: {
  levels: readonly T[];
  copy: Record<T, { label: string; blurb: string }>;
  value: T;
  onChange: (v: T) => void;
  legend: string;
}) {
  return (
    <fieldset className="mt-9">
      <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {legend}
      </legend>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {levels.map((l) => {
          const active = value === l;
          return (
            <button
              key={l}
              type="button"
              aria-pressed={active}
              aria-label={`${copy[l].label}. ${copy[l].blurb}`}
              onClick={() => onChange(l)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                active
                  ? "border-accent bg-accent-dim/15"
                  : "border-border bg-surface hover:border-accent-dim hover:bg-surface-2"
              }`}
            >
              <span className={`block text-sm font-medium ${active ? "text-accent" : "text-foreground"}`}>
                {copy[l].label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{copy[l].blurb}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
