# Product Hunt launch package — Lumen

## Name
Lumen

## Tagline (55 / 60 chars)
Understand your meds, your labs, and whether it can wait

**Alternates**
- Your medications and lab results, explained with sources — 58
- Medicine, made legible — for the person reading it — 52
- Know what you're taking, what your results say, what to do — 59

## Description (PH allows ~260 chars)
Lumen turns the medical information you already have into something you can
actually understand. Photograph your medicine boxes, paste your lab results, or
describe a symptom. Every claim is quoted from its source. It never diagnoses you.

## Topics
Health & Fitness · Artificial Intelligence · Accessibility · Productivity

## First comment — the maker's story

Hi Product Hunt 👋

I built Lumen because of a specific moment I think most people have had.

It's late, something hurts, and you don't know if it matters. You don't want to
wake anyone over nothing. You don't want to sit in a waiting room until dawn over
nothing. So you search it instead — and somewhere around the third result is the
word you were afraid of. Now you're not sleeping either way.

Then the next morning you leave the pharmacy with three boxes and a leaflet folded
into eighths. One says it may cause drowsiness. So does another, in smaller print,
on the back. Nobody mentioned what happens when you take both.

And on Friday at 4:50pm your lab results land in the portal. Your appointment is
Tuesday. Four values are flagged red, none of them are words you've ever used, and
searching them returns a list of things they might mean, sorted roughly by how
frightening they are.

**Lumen is three tools for those three moments.**

📷 **Point your camera at your medicine boxes.** Lumen reads the names, asks you to
confirm them, then tells you what each is for and which combinations are worth
asking a pharmacist about.

📄 **Paste your lab results.** Every value in plain language — including the ones
that were completely fine, which nobody ever tells you. It leads with a count:
"12 results within the ranges on your report, 2 worth discussing, 1 outside."

🩺 **Describe a symptom.** Lumen helps you work out how urgently to seek care, what
would change that answer, and where the nearest real emergency department or
walk-in clinic actually is.

You pick how much you already know, and it explains at your level — from "ferritin
is the pantry, not the plate" up to the pharmacology.

---

**The part I care most about: Lumen shows its working.**

Every AI health tool asks you to trust it. This one doesn't.

When Lumen flags a drug interaction, it quotes the sentence from the official FDA
label, verbatim, and names the drug it came from. If it can't find a supporting
sentence in the retrieved label, it doesn't make the claim. There's an automated
test that fetches the live FDA API and verifies every quote is genuinely present —
no LLM judge, just a string match. A fabricated interaction is the failure that
could actually hurt someone, so it's the one I made structurally detectable.

Same principle everywhere else. Lab reference ranges come only from your own
document — never from the model's memory, because ranges vary by lab, assay, age
and sex. Clinic locations come from real map data, because a hallucinated hospital
is someone driving somewhere that doesn't exist.

**And what Lumen refuses to do:**

- It doesn't diagnose you. It can't examine you, and guessing is how people talk
  themselves out of care they need.
- It never tells you to start, stop, or change a medication.
- It doesn't invent a reference range it can't see on your page.
- It stores nothing. No account, no history, no sign-up.

None of this replaces your doctor. It's about not spending the hours before you
see them frightened by things nobody took the time to explain — and walking in
able to ask a better question.

Free, open, and I'd genuinely love to know where it gets things wrong. 🩵

## Gallery captions

1. **Three moments, three tools.** Medications, lab results, and "should I get this
   checked?" — one place.
2. **It quotes the FDA label, word for word.** Not "trust me" — here's the sentence,
   and here's whose label it's from.
3. **What was fine, first.** Most tools show you three red flags. Lumen tells you the
   twelve results that were within range.
4. **Explained at your level.** The same result becomes an everyday analogy or the
   pharmacology, depending on what you ask for.
5. **It knows when to send you elsewhere.** Urgency, what would change it, and the
   nearest real clinic — from live map data.
6. **30 automated tests.** Including one that verifies every FDA quote against the
   live API.

## Launch-day replies to have ready

**"How is this different from ChatGPT?"**
> Ask a general model about a drug interaction and it answers from memory, with no
> way for you to check it. Lumen retrieves the actual FDA label and quotes the
> sentence it relied on. If there's no supporting sentence, there's no claim. That's
> a different architecture, not a different prompt.

**"Isn't this dangerous?"**
> The dangerous version is the one that tells you what you have. Lumen deliberately
> doesn't — it does triage and explanation, which is what nurse advice lines have
> done for decades. Clinical facts never come from the model: results are
> hand-authored, ranges come from your own document, interactions are quoted from
> labelling, locations come from map data.

**"What about my privacy?"**
> No account, no database, nothing stored. Your report is sent to the model to be
> read and then it's gone. Your location, if you share it, is used once to look up
> nearby care.

**"Does it work outside the US?"**
> Lab explanation and triage work anywhere. Medication labelling is FDA data, so
> it's strongest for US products — non-US brand names may not resolve, and Lumen
> says so explicitly rather than guessing.
