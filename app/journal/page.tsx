import Link from "next/link";
import { getPosts } from "@/lib/journal";

export const metadata = {
  title: "Build journal — Lumen",
  description:
    "How Lumen was built: why a health AI shouldn't diagnose, what happened when the drug interaction API died, and testing AI behaviour by breaking it on purpose.",
};

export default function JournalIndex() {
  const posts = getPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14">
      <Link href="/" className="font-mono text-xs text-muted hover:text-accent">
        ← Lumen
      </Link>

      <header className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Build journal
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Four pieces on how Lumen was built — the safety architecture, an API that
          died mid-project and made the product better, and what it takes to actually
          test an AI product&apos;s behaviour.
        </p>
      </header>

      <ol className="mt-10 space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/journal/${p.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent-dim hover:bg-surface-2 sm:p-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                Part {p.order} · {p.readingMinutes} min read
              </span>
              <h2 className="mt-2.5 text-lg font-medium leading-snug sm:text-xl">
                {p.title}
              </h2>
              <span className="mt-3 text-sm text-accent">
                Read
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
