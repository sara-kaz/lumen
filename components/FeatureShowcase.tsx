import Link from "next/link";

/**
 * Rather than a stock screenshot, this renders a real (miniature) version of Lumen's
 * own medication output — including the FDA citation block, which is the single most
 * distinctive thing about the product. A picture of the actual mechanism beats a photo
 * of a laptop.
 */
function OutputMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-1 flex-1 truncate rounded bg-background px-2.5 py-1 font-mono text-[10px] text-muted">
          lumen.app/meds
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="rounded-lg border-2 border-warn/60 bg-warn/10 px-3.5 py-3">
          <p className="text-[13px] font-medium text-warn">
            Worth raising at your next opportunity
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed">
            These two work in very similar ways, and taking them together can stack up the
            same side effects.
          </p>
        </div>

        <div className="rounded-lg border border-warn/40 bg-surface px-3.5 py-2.5">
          <p className="text-[12px] font-medium text-warn">Effects that stack up</p>
          <p className="mt-1 font-mono text-[9px] text-muted">
            oxybutynin + diphenhydramine
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface px-3.5 py-3">
          <p className="text-[12px] font-medium">Drying and drowsiness</p>
          <blockquote className="mt-2 border-l-2 border-accent-dim bg-surface-2 px-2.5 py-2">
            <p className="text-[10px] leading-relaxed text-muted">
              &ldquo;The concomitant use of oxybutynin with other anticholinergic
              drugs&hellip; may increase the frequency and/or severity of such
              effects.&rdquo;
            </p>
            <cite className="mt-1.5 block font-mono text-[9px] not-italic text-accent">
              — FDA label, oxybutynin
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Every claim carries its source",
    body: "Drug warnings are quoted word-for-word from the official FDA label, with the drug named. If Lumen can't point at a sentence, it doesn't make the claim.",
    icon: (
      <>
        <path d="M7 8h10M7 12h10M7 16h6" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </>
    ),
  },
  {
    title: "Explained at your level",
    body: "Choose how much you already know. The same ferritin result becomes “the pantry, not the plate” or a note about it being an acute-phase reactant.",
    icon: (
      <>
        <path d="M4 18V9M10 18V5M16 18v-6M22 18h-20" />
      </>
    ),
  },
  {
    title: "It knows when to send you elsewhere",
    body: "Describe a symptom and Lumen tells you how urgently to be seen, what would change that answer, and the nearest real clinic or emergency department.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
];

export function FeatureShowcase() {
  return (
    <section className="mt-20">
      <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
        Most health tools ask you to trust them.
        <br />
        <span className="text-accent">This one shows its working.</span>
      </h2>

      <div className="mt-9 grid items-center gap-10 md:grid-cols-2 md:gap-12">
        <OutputMockup />

        <ul className="space-y-7">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex gap-4">
              <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-medium text-accent">{f.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/meds"
        className="mt-9 inline-block rounded-md border border-accent px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-background"
      >
        Try it with your own medicines →
      </Link>
    </section>
  );
}
