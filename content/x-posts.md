# X / Twitter posts

*Lengths are X-adjusted: links count as 23 chars regardless of actual length.*

## Single posts

### A — contrarian hook (recommended) (267 chars)

I built a health AI that refuses to tell you what's wrong with you.

It can't examine you, and guessing is how people talk themselves out of care they need.

It explains your meds and lab results instead — quoting the FDA label word for word.

https://lumen-virid-sigma.vercel.app

### B — the medicine cabinet (260 chars)

One prescription and one OTC sleep aid can stack the same drying and drowsiness effects.

No single label calls it an interaction. Most checkers miss it.

I built one that catches it, and shows you the FDA sentence that warns about it.

https://lumen-virid-sigma.vercel.app

### C — shows its working (250 chars)

Every AI health tool asks you to trust it.

Mine quotes the FDA label word for word, names the drug, and has an automated test that fetches the live FDA API to verify every quote is real.

Not "trust me." Here's the sentence.

https://lumen-virid-sigma.vercel.app

## Thread

**1/8** (184 chars)

I built a health AI that refuses to tell you what's wrong with you.

That sounds like a limitation. It turned out to be the most important design decision in the project.

Here's why 🧵

**2/8** (250 chars)

It's 2:47am and something hurts.

You don't want to wake anyone over nothing. You don't want a four-hour wait over nothing.

So you search it — and somewhere around the third result is the word you were afraid of.

Now you're not sleeping either way.

**3/8** (243 chars)

What you need in that moment isn't a diagnosis. You can't act on a diagnosis.

You need one answer: do I go now, or can this wait?

That's answerable. It's what nurse triage lines have done for decades. And it doesn't require naming a disease.

**4/8** (228 chars)

A differential handed to a frightened person at 3am does one of two things.

Reassures them — and they don't seek care. This is the one that kills people.

Or alarms them — and they still don't know what to do.

Neither is help.

**5/8** (258 chars)

So Lumen does three things instead.

📷 Photograph your medicine boxes → what each is for, and which combinations to ask about
📄 Paste lab results → every value in plain language, including how many were normal
🩺 Describe a symptom → how urgently to seek care

**6/8** (277 chars)

The rule underneath all of it: clinical facts never come from the model.

Drug interactions are quoted verbatim from FDA labelling.
Lab values are read only against the range printed on YOUR report.
Clinic locations come from real map data.

The model does language. Not facts.

**7/8** (265 chars)

And a test fetches the live FDA API and string-matches every quote the product produced.

No LLM judge. Present, or not present.

A fabricated interaction is the failure that could actually hurt someone — so I made it mechanically detectable, not a matter of trust.

**8/8** (192 chars)

It's free, there's no sign-up, and nothing is stored.

I'd genuinely like to know where it's wrong — a medication it can't find, a lab format it misreads.

https://lumen-virid-sigma.vercel.app

## Launch day (256 chars)

Lumen is live on Product Hunt today 🩵

Understand your medications, your lab results, and whether that symptom needs a doctor tonight.

Every claim quoted from its source. Never diagnoses you. Stores nothing.

Would mean a lot if you took a look:
[PH LINK]
