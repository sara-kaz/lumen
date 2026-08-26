# Lumen is live

*Building Lumen, part 4 of 4*

Lumen is live and free: **[URL]**

Three tools for three moments most people have had.

📷 **Photograph your medicine boxes.** What each one is for, and which combinations
are worth asking a pharmacist about — quoted word-for-word from the official FDA
label, with the drug named, so you can check it yourself.

📄 **Paste your lab results.** Every value in plain language, led by a count: *"12
results within the ranges on your report, 2 worth discussing, 1 outside."* Most tools
show you three red flags and you leave convinced your whole body is failing. Lumen
tells you what was fine first.

🩺 **Describe a symptom.** How urgently to seek care, what would change that answer,
and where the nearest real emergency department or walk-in clinic actually is.

You choose how much you already know, and it explains at your level.

## What it won't do

It won't tell you what you have. It can't examine you, and guessing is how people
talk themselves out of care they need. It will never tell you to start, stop, or
change a medication. It doesn't invent a reference range it can't see on your page.
It stores nothing and needs no account.

## What I learned building it

**The constraint was the product.** Refusing to diagnose felt like a limitation when
I chose it. It became the most credible thing about the tool. Every competitor
implies certainty; being the one that says *I can't examine you, so I won't guess*
turned out to be a feature.

**The dead API made it better.** The free drug-interaction database I planned to use
had been retired. Falling back to quoting FDA labels directly forced the interface to
admit its own limits — and surfaced the additive effects that pairwise databases miss
entirely.

**Testing behaviour is possible, and worth it.** 30 specs, one of which fetches the
live FDA API and string-matches every quote. I broke my own prompts on purpose to
confirm the suite catches regressions. It did.

**Know which parts shouldn't be AI.** One route in Lumen deliberately contains no
model call at all — it returns hand-authored text, because a hallucinated lab value
is worse than no lab value.

## What I'd like from you

Tell me where it's wrong.

Specifically: a medication it couldn't resolve, a lab format it misread, a triage
answer that felt off. Those are the reports that make it better, and they're the ones
I can't generate myself.

It's free, there's no sign-up, and nothing is stored.

**[URL]**

*None of this replaces your doctor. It's about not spending the hours before you see
them frightened by things nobody took the time to explain — and walking in able to
ask a better question.*
