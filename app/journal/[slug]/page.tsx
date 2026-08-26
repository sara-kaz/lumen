import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/journal";

/** Pre-render every post at build time — there is no dynamic content here. */
export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) return { title: "Not found — Lumen" };
  return { title: `${post.title} — Lumen`, description: post.subtitle };
}

export default async function JournalPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const posts = getPosts();
  const next = posts.find((p) => p.order === post.order + 1);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-14">
      <Link href="/journal" className="font-mono text-xs text-muted hover:text-accent">
        ← Build journal
      </Link>

      <header className="mt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          Part {post.order} of {posts.length} · {post.readingMinutes} min read
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
          {post.title}
        </h1>
      </header>

      <article
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <nav className="mt-14 border-t border-border pt-6">
        {next ? (
          <Link
            href={`/journal/${next.slug}`}
            className="group block rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent-dim hover:bg-surface-2"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Next · Part {next.order}
            </span>
            <span className="mt-2 block font-medium leading-snug">{next.title}</span>
          </Link>
        ) : (
          <Link
            href="/meds"
            className="group block rounded-xl border border-accent-dim bg-surface p-5 transition-colors hover:border-accent hover:bg-surface-2"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              That&apos;s the series
            </span>
            <span className="mt-2 block font-medium leading-snug">
              Try Lumen with your own medicines →
            </span>
          </Link>
        )}
      </nav>
    </main>
  );
}
