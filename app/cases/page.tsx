import Link from "next/link";
import { CASES } from "@/lib/cases";

const DIFFICULTY_LABEL: Record<string, string> = {
  intro: "Intro",
  core: "Core",
  hard: "Hard",
};

export const metadata = {
  title: "Cases — Lumen",
  description:
    "Question banks test recall. Lumen tests judgment. Take a history from a simulated patient and get graded on your clinical reasoning.",
};

export default function CasesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent">
        ← Lumen
      </Link>

      <header className="mb-12 mt-6">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Question banks test recall.
          <br />
          <span className="text-accent">This tests judgment.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
          You get a chief complaint and nothing else. Take a history in your own
          words — the patient answers vaguely, forgets things, and volunteers
          nothing you don&apos;t ask for. Order your own investigations and pay
          for them. Commit to a diagnosis. Then find out what you missed.
        </p>
      </header>

      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Cases
      </h2>
      <ul className="space-y-3">
        {CASES.map((c) => (
          <li key={c.id}>
            <Link
              href={`/case/${c.id}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-accent-dim hover:bg-surface-2"
            >
              <div className="min-w-0">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 truncate text-sm text-muted">
                  &ldquo;{c.chiefComplaint}&rdquo;
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden font-mono text-[11px] text-muted sm:inline">
                  {c.specialty}
                </span>
                <span className="rounded border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
                  {DIFFICULTY_LABEL[c.difficulty]}
                </span>
                <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mt-14 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        Every patient here is fictional. Lumen is a training simulator, not a
        diagnostic tool.
      </footer>
    </main>
  );
}
