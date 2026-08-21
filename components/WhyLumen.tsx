import Link from "next/link";

/**
 * The motivation section.
 *
 * Deliberately written as recognition rather than persuasion: each moment is one a
 * real person has actually had, and each resolves into something concrete you can do
 * about it. The closing line de-escalates on purpose — a health product that leaves
 * someone more frightened than it found them has failed, whatever it sells.
 */
const MOMENTS = [
  {
    when: "2:47 AM",
    where: "Awake, and something hurts",
    story:
      "You don't know if this matters. You don't want to wake anyone over nothing, and you don't want to sit in a waiting room until dawn over nothing either. So you search it instead — and somewhere around the third result is the word you were afraid of. Now you're not sleeping regardless.",
    answer: "How urgently you should be seen, what would change that answer, and where the nearest place that helps actually is.",
    href: "/care",
    cta: "Where should I go?",
  },
  {
    when: "The next morning",
    where: "Three boxes and a folded leaflet",
    story:
      "One says it may cause drowsiness. So does another, in smaller print, on the back. Nobody mentioned what happens when you take both. You've had a headache for two days now and you've become afraid to take anything for it, in case it's the thing that makes something worse.",
    answer: "What each medicine is for, and which combinations are worth asking about — quoted word-for-word from the official label.",
    href: "/meds",
    cta: "What am I taking?",
  },
  {
    when: "Friday, 4:50 PM",
    where: "The results land in the portal",
    story:
      "Your appointment is Tuesday. Four values are flagged in red, none of them are words you have ever used, and searching them returns a list of things they might mean, sorted roughly by how frightening they are. You have the whole weekend to think about it.",
    answer: "Every value on the page in plain language — including the ones that were completely fine, which nobody ever tells you.",
    href: "/labs",
    cta: "What do my results mean?",
  },
];

export function WhyLumen() {
  return (
    <section className="mt-20" aria-labelledby="why-lumen">
      <h2
        id="why-lumen"
        className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
      >
        The worst time to need answers
        <br />
        <span className="text-accent">is exactly when you&apos;re least likely to get them.</span>
      </h2>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
        Clinics are shut. Nobody wants to be the person who overreacted. And the internet
        is very good at telling you the worst thing it could possibly be.
      </p>

      <ol className="mt-10 space-y-4">
        {MOMENTS.map((m) => (
          <li
            key={m.href}
            className="rounded-xl border border-border bg-surface p-5 sm:p-7"
          >
            <div className="grid gap-5 md:grid-cols-[10rem_1fr] md:gap-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  {m.when}
                </p>
                <p className="mt-1.5 text-sm leading-snug text-muted">{m.where}</p>
              </div>

              <div className="min-w-0">
                <p className="text-[15px] leading-relaxed sm:text-base">{m.story}</p>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[15px] leading-relaxed text-muted">
                    <span className="font-medium text-accent">Lumen gives you: </span>
                    {m.answer}
                  </p>
                  <Link
                    href={m.href}
                    className="mt-3 inline-block text-sm text-accent hover:underline"
                  >
                    {m.cta} →
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-2xl border-l-2 border-accent-dim pl-5 text-[15px] leading-relaxed">
        None of this replaces your doctor, and none of it is meant to. It&apos;s about not
        spending the hours before you see them frightened by things nobody took the time
        to explain — and walking in able to ask a better question.
      </p>
    </section>
  );
}
