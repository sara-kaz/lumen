# I built a health AI that refuses to tell you what's wrong with you

*Building Lumen, part 1 of 4*

Every AI health tool on the market implies it can tell you what you have. Describe
your symptoms, receive a list of conditions, ranked. It's the obvious product.

I built the opposite, on purpose, and it turned out to be the most interesting
design decision in the whole project.

## The moment that defines the product

It's late. Something hurts. You don't know if it matters.

You don't want to wake anyone over nothing. You don't want to sit in a waiting room
until dawn over nothing. So you search it — and somewhere around the third result
is the word you were afraid of.

Here's what I noticed about that moment: **the thing you actually need is not a
diagnosis.** You cannot act on a diagnosis. You're not going to treat yourself.

What you need is the answer to one question: *do I go now, or can this wait until
morning?*

That question is answerable. It's what nurse triage lines have done for decades. And
answering it doesn't require naming a disease.

## Why guessing is the dangerous option

A differential diagnosis handed to a frightened person at 3am does one of two things,
and both are bad.

If it's reassuring, they don't seek care. This is the one that kills people. "Chest
pain in a 34-year-old is usually musculoskeletal" is *true*, and it's exactly the
sentence that keeps someone on the sofa through a pulmonary embolism.

If it's alarming, they catastrophise, and they still don't know what to do.

There's a regulatory dimension too — symptom checkers that output diagnoses land in
medical-device territory in both the US and EU. But honestly, the safety argument
got there first.

## What I built instead

Lumen leads with disposition, not diagnosis:

> **Go to an emergency department now**
> Call an ambulance — do not drive yourself and do not wait to see if it eases. Chest
> pressure lasting 40 minutes with sweating and pain spreading into your left arm
> needs emergency assessment immediately.

Then, always: **what would change this answer.** Specific, concrete return
precautions, even when the answer is "stay home." That section is the safety net for
everything the model got wrong, and it's the one part of the interface I refuse to
let collapse behind a fold.

"What might this be" appears only under a heading that says *For orientation only —
not about you*: broad, unranked categories, explicitly framed as general education.
And when there's a red flag present, the model returns that section **empty** — so
nobody can talk themselves out of care by reading it.

## The rule underneath everything

The principle generalised across the whole product:

**Clinical facts never come from the model. The model handles language and judgment.**

| Where a mistake would hurt | How it's prevented |
|---|---|
| A fabricated drug interaction | Must quote a verbatim sentence from the retrieved FDA label. No quote, no claim. |
| An invented lab reference range | Only ranges printed on the user's own document. Ranges vary by lab, assay, age and sex. |
| A hallucinated hospital | Locations come from real map data. Someone driving somewhere that doesn't exist, mid-heart-attack, is unrecoverable. |
| A made-up test result | Case results are hand-authored and returned verbatim. That endpoint never calls a model at all. |

That last row is worth dwelling on. One of Lumen's API routes deliberately has **no
AI in it**. It returns pre-written text. Building an AI product means knowing which
parts should not be AI.

## The counterintuitive bit

I expected the refusal to feel like a limitation.

It's the strongest thing about the product. When every competitor implies certainty,
being the one that openly says *I can't examine you, so I won't guess — here's what I
can tell you instead* is more credible, not less.

The constraint made the product better. That's rarer than it sounds.

---

*Next: the drug interaction API that died, and why that turned out to be lucky.*
