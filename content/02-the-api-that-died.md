# The drug interaction API I planned to use had been shut down. It made the product better.

*Building Lumen, part 2 of 4*

I was building a medication tool: photograph your medicine boxes, find out which
combinations are worth asking a pharmacist about.

The plan was obvious. The US National Library of Medicine runs RxNav, which has a
free drug interaction endpoint. Look up each drug, ask for the pairwise
interactions, present them.

I checked the endpoint before writing a line of code against it.

```
HTTP 404
```

It had been retired. There is no free, curated, pairwise drug-interaction API left.

## The tempting fix

The easy path was right there: just ask the model.

Frontier models know a great deal about drug interactions. It would have demoed fine.
It would have been *right* most of the time.

And "most of the time" is the problem. A fabricated interaction is invisible — it
reads exactly like a real one. The user has no way to check. If the model
hallucinates a warning about a medication someone actually takes, that person may
stop taking it. That's not a UX bug; that's a person off their heart medication.

I couldn't think of a way to make that safe, so I stopped trying to.

## What I did instead

The FDA publishes drug labelling through openFDA — free, no key, authoritative. Each
label has a `drug_interactions` section written by the manufacturer and reviewed by
the regulator.

So the architecture became:

1. **RxNorm** normalises what you typed. "Lipitor" and a misspelt "atorvastatn" both
   resolve to atorvastatin.
2. **openFDA** returns that drug's actual label text.
3. The model receives *only that retrieved text*, plus your list of medicines, and is
   asked which parts of the labelling apply to the other drugs you take.
4. **Every finding must quote the sentence it relied on, verbatim.**

That last rule is the whole design. The output looks like this:

> **Why Lumen flagged this**
> "The concomitant use of oxybutynin with other anticholinergic drugs or with other
> agents which produce dry mouth, constipation, somnolence…"
> — FDA label, oxybutynin

The model isn't recalling. It's reading a document I handed it and pointing at a line.

## The test that makes it real

A rule in a prompt is a suggestion. So there's an automated test that:

1. Takes every quote in the output
2. Fetches the live FDA label for the drug named as its source
3. Does a **string match**

No LLM judge. No fuzzy similarity. Present, or not present. It's the most valuable
test in the suite precisely because it's the dumbest one.

## The unexpected upside

Two things fell out of this that I didn't plan.

**The product got more honest.** Because labels are per-drug rather than pairwise,
Lumen can't claim to have checked every combination. So it says so:

> "Amlodipine and atorvastatin together — neither label names the other, so I have
> nothing to report either way. Please don't read that as a clearance."

An interaction database would have implied a completeness it doesn't have. Working
from labels forced the interface to admit its own limits, which is what a pharmacist
would do.

**It found the thing databases miss.** Interaction checkers work on pairs. But the
most common real-world harm is *additive* — several drugs that each cause mild
drowsiness, or several with anticholinergic effects, none of which any single label
calls an interaction.

Lumen has a section called **Effects that stack up**, and it's the most useful output
in the tool. Two over-the-counter products and one prescription, each individually
unremarkable, adding up to the confusion nobody attributed to medication.

The dead API forced a better product. I'd like to claim I planned that.

---

*Next: 30 tests, and deliberately breaking my own product to prove they work.*
