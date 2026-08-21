import Link from "next/link";
import { LumenWordmark } from "@/components/LumenMark";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-16">
      <header className="mb-11">
        <div className="mb-4">
          <LumenWordmark />
        </div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Medicine, made legible.
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted">
          Clinical information is written for clinicians. Lumen translates it — so the
          person holding the box, or the results, actually knows what they say.
        </p>
      </header>

      {/* Primary door. */}
      <Link
        href="/meds"
        className="group rounded-xl border border-accent-dim bg-surface p-6 transition-colors hover:border-accent hover:bg-surface-2 sm:p-7"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          Start here
        </p>
        <h2 className="mt-3 text-2xl font-medium">What am I actually taking?</h2>
        <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-muted">
          Photograph your medicine boxes or type the names. Find out what each one is for,
          and which combinations are worth asking a pharmacist about — every claim quoted
          from official FDA labelling.
        </p>
        <span className="mt-5 inline-block text-sm text-accent">
          Explain my medicines
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href="/labs"
          className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent-dim hover:bg-surface-2"
        >
          <h3 className="font-medium">Explain my lab report</h3>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
            Every value on the page, in words you choose the level of.
          </p>
          <span className="mt-4 text-sm text-muted transition-colors group-hover:text-accent">
            Open →
          </span>
        </Link>

        <Link
          href="/care"
          className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent-dim hover:bg-surface-2"
        >
          <h3 className="font-medium">Where should I go?</h3>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
            How urgently you need to be seen, what to watch for, and the nearest place
            that can help.
          </p>
          <span className="mt-4 text-sm text-muted transition-colors group-hover:text-accent">
            Open →
          </span>
        </Link>
      </div>

      <footer className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        Lumen explains information and helps you judge urgency. It does not diagnose,
        never tells you to change a medication, and is not a substitute for your clinician
        or pharmacist. In an emergency, call your local emergency number.
      </footer>
    </main>
  );
}
