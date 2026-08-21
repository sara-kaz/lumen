"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CareArt, LabsArt, MedsArt } from "./SlideArt";

const SLIDES = [
  {
    href: "/meds",
    cta: "Explain my medicines",
    art: MedsArt,
    lead: "Two of your tablets",
    headline: "may be doing the same thing to you.",
    body: "Photograph the boxes. Lumen quotes the official FDA label word-for-word, so you can see exactly where every warning comes from.",
  },
  {
    href: "/labs",
    cta: "Explain my results",
    art: LabsArt,
    lead: "Your results arrived",
    headline: "before the explanation did.",
    body: "Every value on the page in plain language — including the normal ones — and the questions worth taking to your appointment.",
  },
  {
    href: "/care",
    cta: "Find out where to go",
    art: CareArt,
    lead: "It's 11pm and you don't know",
    headline: "if this can wait.",
    body: "How urgently you should be seen, exactly what would change that answer, and where the nearest place that helps actually is.",
  },
];

const INTERVAL_MS = 7000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    // Auto-advancing text is hostile to anyone who reads slowly, and outright
    // disorienting for people who ask the OS not to animate things.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;

    timer.current = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const active = SLIDES[index]!;
  const Art = active.art;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="What Lumen can help with"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 30%, transparent), transparent)",
        }}
      />

      <div
        // Screen readers get told when the slide changes, but politely.
        aria-live="polite"
        aria-atomic="true"
        className="grid items-center gap-6 px-6 py-8 sm:px-10 sm:py-11 md:grid-cols-[1fr_auto] md:gap-10"
      >
        <div key={index} className="animate-[fadeIn_450ms_ease-out]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Slide {index + 1} of {SLIDES.length}
          </p>
          <h2 className="mt-3 text-[1.7rem] font-semibold leading-[1.15] tracking-tight sm:text-4xl">
            {active.lead}
            <br />
            <span className="text-accent">{active.headline}</span>
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">{active.body}</p>
          <Link
            href={active.href}
            className="mt-6 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            {active.cta} →
          </Link>
        </div>

        <div className="hidden h-[150px] w-[220px] text-accent md:block">
          <Art />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-6 py-3 sm:px-10">
        <div className="flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.href}
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}: ${s.lead} ${s.headline}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-7 bg-accent" : "w-2 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="rounded-md border border-border px-2.5 py-1 font-mono text-sm text-muted transition-colors hover:border-accent-dim hover:text-foreground"
          >
            ‹
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="rounded-md border border-border px-2.5 py-1 font-mono text-sm text-muted transition-colors hover:border-accent-dim hover:text-foreground"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
