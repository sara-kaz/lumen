import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Lumen</p>
      <h1 className="mt-4 text-2xl font-semibold leading-snug">
        That page doesn&apos;t exist.
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        The link may be out of date, or mistyped. Here&apos;s everything Lumen can help
        with:
      </p>

      <ul className="mt-7 space-y-2.5">
        {[
          { href: "/meds", label: "What am I taking?" },
          { href: "/labs", label: "What do my results mean?" },
          { href: "/care", label: "Should I get this checked?" },
        ].map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-lg border border-border bg-surface px-5 py-3.5 text-[15px] transition-colors hover:border-accent-dim hover:bg-surface-2"
            >
              {l.label} <span className="text-accent">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
