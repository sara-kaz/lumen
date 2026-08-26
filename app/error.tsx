"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Crashes on a health product are a trust event, not just a bug. The default Next
 * error page shows a stack trace, which reads as "this is broken and unsafe" to
 * exactly the person least equipped to judge that.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lumen error boundary:", error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Lumen</p>
      <h1 className="mt-4 text-2xl font-semibold leading-snug">
        Something went wrong on our side.
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        This is a fault in Lumen, not in anything you did or anything you uploaded.
        Nothing you entered was saved.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-border px-5 py-2.5 text-sm transition-colors hover:border-accent-dim hover:bg-surface"
        >
          Back to start
        </Link>
      </div>

      <p className="mt-10 rounded-lg border border-danger/40 bg-danger/5 px-5 py-4 text-sm leading-relaxed">
        <strong>If you were checking something urgent</strong> — don&apos;t wait on this
        page. Contact your local emergency number, a pharmacist, or your clinician
        directly.
      </p>

      {error.digest && (
        <p className="mt-6 font-mono text-[11px] text-muted">Reference: {error.digest}</p>
      )}
    </main>
  );
}
