import Link from "next/link";
import { LumenWordmark } from "@/components/LumenMark";
import { CompassIcon, PillIcon, ReportIcon } from "@/components/DoorIcons";
import { HeroCarousel } from "@/components/HeroCarousel";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { WhyLumen } from "@/components/WhyLumen";

/**
 * People arrive with a question, not a category — so each door is phrased as the
 * question they already have in their head, and all three are equal weight. A visitor
 * holding a lab report does not care which one we consider "primary".
 */
const DOORS = [
  {
    href: "/meds",
    icon: PillIcon,
    question: "What am I taking?",
    body: "Photograph your medicine boxes or type the names. What each one does, and which combinations to ask about.",
    detail: "Quotes official FDA labelling",
  },
  {
    href: "/labs",
    icon: ReportIcon,
    question: "What do my results mean?",
    body: "Every value on your report explained — including the normal ones — at whatever level of detail you want.",
    detail: "Never invents a reference range",
  },
  {
    href: "/care",
    icon: CompassIcon,
    question: "Should I get this checked?",
    body: "How urgently to seek care, what would change that answer, and where the nearest place that helps actually is.",
    detail: "Real clinic and ER locations",
  },
];

const PROMISES = [
  { title: "Lumen doesn't diagnose you", body: "It can't examine you, and guessing is how people talk themselves out of care." },
  { title: "Nothing is stored", body: "Used to answer your question, then gone." },
  { title: "No account, no sign-up", body: "Open it, use it, close it." },
];

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-5xl overflow-x-clip px-5 py-12 sm:px-6 sm:py-20">
      {/* Light through an opening — the mark, at page scale. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] max-w-[130vw] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent)",
        }}
      />

      <header className="max-w-2xl">
        <LumenWordmark />
        <h1 className="mt-5 text-[2.15rem] font-semibold leading-[1.08] tracking-tight sm:mt-6 sm:text-6xl">
          Medicine,
          <br />
          made legible.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted sm:mt-6 sm:text-lg">
          Understand what you&apos;re taking, what your results mean, and whether that
          symptom needs a doctor tonight — in plain language, from real sources.
        </p>
      </header>

      <div className="mt-10 sm:mt-12">
        <HeroCarousel />
      </div>

      <nav aria-label="What would you like help with" className="mt-10 grid gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">
        {DOORS.map(({ href, icon: Icon, question, body, detail }) => (
          <Link
            key={href}
            href={href}
            // Without this a screen reader announces the whole card body per link.
            aria-label={question}
            className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent-dim hover:bg-surface-2 sm:p-6"
          >
            <span className="flex items-center gap-3">
              <span className="text-accent transition-transform group-hover:scale-110">
                <Icon />
              </span>
              <h2 className="text-lg font-medium leading-snug sm:text-xl">{question}</h2>
            </span>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-[15px]">
              {body}
            </p>
            <span className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-border pt-3.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted sm:text-[11px]">
                {detail}
              </span>
              <span className="text-sm text-accent">
                Start
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </span>
          </Link>
        ))}
      </nav>

      <WhyLumen />

      <FeatureShowcase />

      <section className="mt-16 rounded-xl border border-border bg-surface px-6 py-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {PROMISES.map((p) => (
            <div key={p.title} className="flex gap-3">
              <span className="mt-1 shrink-0 text-accent" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <div>
                <p className="text-[15px] font-medium">{p.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-surface px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div>
            <p className="font-medium">Training in medicine?</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Take a history from a simulated patient who volunteers nothing, then get
              graded on your reasoning.
            </p>
          </div>
          <Link
            href="/cases"
            className="shrink-0 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface-2"
          >
            Open the case simulator →
          </Link>
        </div>
      </section>

      <footer className="mt-14 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        Lumen is an information tool. It does not diagnose, never tells you to start or
        stop a medication, and is not a substitute for your clinician or pharmacist.{" "}
        <strong className="text-foreground">
          If this is an emergency, call your local emergency number.
        </strong>
      </footer>
    </main>
  );
}
