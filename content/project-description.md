# Lumen — project description

## One line
Lumen makes the medical information you already have readable — your medications,
your lab results, and whether that symptom needs a doctor tonight.

## Short (50 words — for tight form fields)
Lumen explains the medical information you already have. Photograph your medicine
boxes, paste your lab results, or describe a symptom. Every claim is quoted from its
source — FDA labelling, your own report, real map data. It never diagnoses you, and
it stores nothing.

## Standard (180 words — default answer)
Clinical information is written for clinicians. Lumen translates it for the person
actually holding it.

Three tools, for three moments most people have had. **Photograph your medicine
boxes** and Lumen tells you what each one is for and which combinations are worth
asking a pharmacist about — quoting the official FDA label word for word, with the
drug named, so you can verify it yourself. **Paste your lab results** and every value
is explained in plain language, led by a count of how many were completely normal,
which nobody ever tells you. **Describe a symptom** and Lumen helps you judge how
urgently to seek care, what would change that answer, and where the nearest real
emergency department or walk-in clinic is.

You choose how much you already know, and it explains at your level.

The architectural commitment is that clinical facts never come from the model. The
model handles language and judgment; every fact is retrieved from an authoritative
source and cited. Lumen does not diagnose, never tells you to change a medication,
never invents a reference range, and stores nothing.


## 500-character version (for capped form fields)

Clinical information is written for clinicians. Lumen translates it for the person holding it.

Photograph your medicine boxes to see what each is for, and which combinations to ask a pharmacist about — quoted word for word from the official FDA label. Paste your lab results for every value in plain language, including how many were normal. Describe a symptom for how urgently to seek care, and where to go.

Clinical facts never come from the model. It doesn't diagnose you, and stores nothing.

## Full (problem / solution / user / how)

### The problem
It's late, something hurts, and you don't know if it matters. You don't want to wake
anyone over nothing, and you don't want a four-hour wait over nothing. So you search
it — and somewhere around the third result is the word you were afraid of.

The same gap repeats in two other moments. You leave a pharmacy with three boxes and
a leaflet folded into eighths; two of them warn about drowsiness and nobody mentioned
what happens when you take both. Your lab results land in a portal on a Friday
afternoon, your appointment is Tuesday, and four values are flagged red in words you
have never used.

In every case the information exists. It was simply never written for you. And the
default alternative — an unfiltered search — reliably produces the most frightening
possible interpretation, with no way to judge how likely any of it is.

### The solution
Lumen is three tools that share one promise: make what you already have legible, and
help you decide what to do next.

- **Medications** — camera or typed input. Names resolved through RxNorm, labelling
  retrieved from openFDA, then explained. Interaction findings must quote a verbatim
  sentence from the retrieved label; no supporting sentence means no claim. A separate
  section surfaces additive effects that no single label calls an interaction, which
  is where most real-world harm actually comes from.
- **Lab results** — text, PDF, or a photo. Every value explained, normals included,
  interpreted only against the reference range printed on the user's own document.
- **Care navigation** — symptom description to urgency, explicit return precautions,
  and nearby facilities from OpenStreetMap. Crisis disclosures route to support lines
  rather than a hospital list.

Three reader levels adjust vocabulary and depth without changing the substance.

### Who it's for
Anyone holding medical information they can't read. In practice that clusters into
people managing several medications (and the family members managing them on someone
else's behalf), people who receive results through a patient portal before anyone
explains them, and people deciding at an inconvenient hour whether something can wait.

A secondary audience — medical students — uses a clinical reasoning simulator built on
the same foundations.

### How it's built
Next.js and TypeScript, with Claude Opus 5 for language and judgment only. Grounding
comes from RxNorm, openFDA, and OpenStreetMap. Structured outputs are schema-validated;
prompt caching and per-call reasoning effort are tuned per route.

Behaviour is covered by 30 automated evals, including one that fetches the live FDA API
and string-matches every citation the product produced — a fabricated interaction is the
failure that could genuinely hurt someone, so it is made mechanically detectable rather
than left to trust. The suite is verified to fail: deliberately removing a safety rule
turns it red.

No accounts, no database, nothing stored.
