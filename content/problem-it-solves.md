# The problem it solves (Devfolio field)

**People are routinely handed medical information that was never written for them —
and the default alternative is a search engine that reliably returns the most
frightening possible interpretation.**

Lumen closes that gap in three specific situations.

---

### 🔴 You get your results before anyone explains them

Portals release lab results the moment they're ready. Your appointment might be days
away. Four values are flagged red, none of them are words you've used before, and
searching them returns a list of things they *might* mean, sorted roughly by how
alarming they are.

**Lumen explains every value on the page in plain language — including the ones that
were completely normal.** Most tools show you three red flags and you leave convinced
your whole body is failing. Lumen leads with the count: *"12 results within the ranges
on your report, 2 worth discussing, 1 outside."* That single reframing is the
difference between a weekend of panic and a useful question on Tuesday.

Crucially, it interprets **only against the reference range printed on your own
report** — never a range recalled from training data, because ranges vary by
laboratory, assay, age and sex.

---

### 🟠 Nobody tells you what happens when your medicines are combined

You leave the pharmacy with three boxes and a leaflet folded into eighths. One warns
about drowsiness. So does another, in smaller print, on the back. Nobody mentioned
what happens when you take both.

**Photograph the boxes and Lumen tells you what each is for and which combinations are
worth raising with a pharmacist** — quoting the official FDA label word for word, with
the drug named, so you can verify it yourself rather than taking an AI's word for it.

It also surfaces the thing interaction databases structurally miss: **additive
effects**. Several medicines that each cause mild drowsiness, or several with
anticholinergic drying effects — none of which any single label calls an interaction,
but which together cause real harm, particularly in older adults. That's a genuine
safety improvement over a pairwise checker, not a repackaging of one.

---

### 🟡 It's late and you don't know whether this can wait

You don't want to wake anyone over nothing. You don't want a four-hour wait over
nothing. So you search it, and now you're frightened *and* no better informed.

**Lumen tells you how urgently to seek care, what specifically would change that
answer, and where the nearest real emergency department or walk-in clinic actually
is** — from live map data, never a generated address.

It deliberately does **not** tell you what you have. It can't examine you, and a
confident guess is how people talk themselves out of care they need. Return
precautions are always shown, even when the answer is "reasonable to manage at home."

---

### How it makes this *safer*, not just easier

The architectural commitment: **clinical facts never come from the model.** The model
handles language and judgment; every fact is retrieved from an authoritative source
and cited.

| Where a mistake would hurt | How it's prevented |
|---|---|
| A fabricated drug interaction | Must quote a verbatim sentence from the retrieved FDA label. No supporting sentence, no claim. |
| An invented reference range | Only ranges printed on the user's own document are used. |
| A hallucinated hospital | Locations come from real map data — someone driving to an address that doesn't exist, mid-emergency, is unrecoverable. |
| An over-confident diagnosis | Lumen refuses to diagnose at all. |

This is verified, not asserted: **30 automated behavioural tests**, including one that
fetches the live FDA API and string-matches every citation the product produced. No
LLM judge — present, or not present. The suite is proven to fail by deliberately
removing a safety rule and watching it go red.

---

### Who it helps most

- **People managing several medications** — and the family members managing them on
  someone else's behalf
- **Anyone who receives results through a patient portal** before a clinician has
  talked them through
- **People deciding at an inconvenient hour** whether a symptom can wait
- **Anyone who has been made more anxious by searching their symptoms** — which is
  most people

Three reader levels adapt the vocabulary without changing the substance: the same
ferritin result becomes *"the pantry, not the plate"* or a note about it being an
acute-phase reactant, depending on what you ask for.

**No account, no sign-up, nothing stored.**
