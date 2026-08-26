# I wrote 30 tests for an AI product, then broke it on purpose to check they worked

*Building Lumen, part 3 of 4*

Most AI products aren't tested. Not out of laziness — because it isn't obvious *how*.
There's no assertion for "is this explanation good."

But a lot of what matters in an AI product isn't quality. It's **behaviour**, and
behaviour is testable.

## The behaviour that is the product

Lumen has a clinical case simulator where an AI plays a patient. The single most
important thing it does is **withhold information**.

Here's the target behaviour, from a real run:

> **Q:** "Do you have any medical problems or take any medications?"
> **Patient:** "Not really. I had panic attacks in my twenties. No, I don't take any
> medications."

She has been on the combined contraceptive pill for six years.

That's not a bug. That's the product. Real patients don't consider the pill a
medication, and a student who asks the vague question gets the vague answer. Ask
properly and you get:

> "Oh — yeah, I'm on the pill. The combined one. About six years. Sorry, I didn't
> think of that as medication."

An LLM told to "play a patient" is relentlessly helpful by default. It volunteers the
entire history and all but names the diagnosis. Getting it to withhold took careful
prompting — and **prompting silently regresses.** You tweak something unrelated three
days later and the patient starts being helpful again. The app still works. It just
stops teaching anything.

That's the class of failure worth testing.

## What the suite actually checks

30 specs, roughly 170 seconds, against a live server so real routes and validation run:

- **Patient behaviour (10)** — vague questions must *fail* to surface the pill;
  targeted ones must succeed.
- **Grader calibration (4)** — a poor encounter must score low, and a lucky correct
  guess with no history must earn no history score.
- **Lab explainer (6)** — never invents a reference range, escalates a critical
  potassium, and the reader levels measurably differ.
- **Medications (5)** — every FDA citation verified verbatim against the live API.
- **Triage (5)** — cardiac and stroke presentations must escalate, a sore throat must
  not, and a crisis disclosure must return **zero** hospital results and route to a
  crisis line instead.

Assertions are semantic where they need to be. Keyword matching would be useless — a
patient can disclose a flight as "I was in the air for fourteen hours" with no
matching substring, and can say the word "clot" while denying knowing anything about
one.

## Then I broke it on purpose

A green test suite proves nothing until you've watched it go red.

So I gutted the "never volunteer information" rule from the patient prompt and reran.

```
FAIL  pe / vague medication question fails to surface the pill
    · LEAKED that she takes hormonal contraception —
      "I take the pill — the combined one, been on it about six years."
```

Caught it, with the leaked quote attached, and exited non-zero. Restored the rule,
reran, green.

**That five-minute exercise is the difference between having tests and having tests
that work.** I'd encourage anyone shipping an AI product to do it once. It's
uncomfortable how often the suite doesn't catch it.

## The bug in my own safety check

One eval verifies that every FDA quote genuinely appears in the label. It started
failing:

```
FABRICATED QUOTE (Oxybutynin chloride extended-release tablets):
no label retrievable
```

Alarming — until I looked. The quote *was* verbatim. The model had cited the label's
full product title rather than the drug name, so my lookup couldn't retrieve anything
to check against. My code then reported "could not verify" as **"FABRICATED."**

That's a worse bug than the one it was hunting. A safety check that cries wolf when
it merely failed to look something up destroys trust in the entire suite — you start
ignoring it, which is precisely when it catches something real.

Two fixes. The product now cites the plain drug name. And the check returns a
**three-way verdict**: `ok`, `mismatch` (label retrieved, quote absent — a real
failure), or `unchecked` (nothing retrieved, nothing proven).

Conflating "I checked and it's wrong" with "I couldn't check" is a mistake worth
naming, because it's easy to make and hard to notice.

## The one incidental finding

While the prompt was broken, one case still passed — the geriatric one. Its
disclosure rules live in the **case data**, not the shared prompt, so it survived
damage that broke the others.

Encoding behaviour in data is more robust than relying on a shared prompt. I only
learned that because I broke something and watched what didn't fall over.

---

*Next: launch day.*
