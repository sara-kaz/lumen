# Lumen

**Medicine, made legible.**

Clinical information is written for clinicians. Lumen translates it — so the person
holding the box, or the results, actually knows what they say.

Three products, one promise:

| Route | For | What it does |
|---|---|---|
| **`/meds`** | Anyone taking medication | Photograph your boxes or type the names. What each one is for, and which combinations to ask a pharmacist about — every claim quoted from official FDA labelling. |
| **`/labs`** | Anyone who got results | Every value on the report explained at a reading level you choose. What it can't tell you, and what to ask. |
| **`/cases`** | Medical students | Take a history from a simulated patient who volunteers nothing, order your own workup, commit to a diagnosis, get graded on your reasoning. |

## Running it

```bash
cp .env.local.example .env.local   # add your Anthropic API key
npm install
npm run dev
```

## The one idea worth understanding

**Clinical facts never come from the model.** The model handles language and judgment;
every fact is either hand-authored or retrieved from an authoritative source. This is
the answer to "how do you know it's safe," and it shapes every route:

| Where a mistake would hurt | How it's prevented |
|---|---|
| A hallucinated lab result in a case | Results are pre-authored in the case file and returned verbatim. `/api/order` never calls a model. |
| A fabricated reference range | Only ranges printed on the user's own document are shown. Ranges vary by lab, assay, age and sex — a remembered one presented as the report's is worse than none. |
| An invented drug interaction | Every finding must quote a verbatim sentence from the FDA label retrieved for that drug. No quote, no finding. |
| Leaking the diagnosis to a student | `toPublicCase()` is a hard boundary — the diagnosis, hidden history and results never reach the browser. |

RxNav's pairwise interaction endpoint was retired and now 404s, so there is no free
curated interaction database. `/meds` reads each drug's own FDA label instead and says
plainly what it could not check — silence would read as "all clear," which would be a lie.

## Architecture

| Piece | File | Notes |
|---|---|---|
| Case schema | `lib/types.ts` | `toPublicCase()` is the security boundary |
| Cases | `lib/cases/*.ts` | Six seed cases, registered in `index.ts` |
| Simulator prompts | `lib/prompts.ts` | Patient roleplay, optional collateral historian, Dr. Ellis's grading rubric |
| Explainer | `lib/explain.ts` | Iris's persona + three reader levels |
| Medications | `lib/meds.ts`, `lib/rxnorm.ts`, `lib/openfda.ts` | Name resolution, label retrieval, grounded prompt |
| Rate limiting | `lib/ratelimit.ts` | Per-IP and global caps — see caveats below |
| Patient chat | `app/api/chat/route.ts` | Streaming, `effort: low`, system prompt cached |
| Grading | `app/api/grade/route.ts` | `messages.parse()` + Zod, `effort: high` |
| Lab explainer | `app/api/explain/route.ts` | Text, PDF, or photo |
| Medications | `app/api/meds/{identify,explain}` | Two-step: read the photo, **confirm**, then look up |

Everything runs on **Claude Opus 5** via the Anthropic TypeScript SDK — streaming for
dialogue, structured outputs with Zod for grading and parsing, vision and document input
for photos and PDFs, prompt caching on the per-case system prompt, and per-call effort
control (`low` where latency matters, `high` where a misread value would).

## The two personas

**Iris** explains medications and lab results. Calm, first person, never diagnoses,
never tells you to change a medication. Adapts to three reader levels — from *"ferritin
is the pantry, not the plate"* to the acute-phase-reactant caveat.

**Dr. Ellis** debriefs students after a case. Opens before any score is shown, credits
what went right before what went wrong, and explains consequences rather than issuing
verdicts.

## Evals

```bash
npm run eval                 # all 25 specs, ~170s
npm run eval -- patient      # filter by name
npm run eval -- "meds /"     # just the medication specs
```

Runs against a live dev server, so real routes, validation and prompts are exercised.
Exits non-zero on failure.

- **Patient behaviour (10)** — vague questions must *fail* to surface the contraceptive
  pill; targeted ones must succeed. Uses a semantic judge, because a patient can disclose
  a flight as "I was in the air for fourteen hours" with no matching substring.
- **Grader calibration (4)** — poor encounters score low, a vague question earns no rubric
  credit, and a lucky correct guess with no history earns no history score.
- **Lab explainer (6)** — no invented ranges, critical potassium escalates, reader levels
  measurably differ.
- **Medications (5)** — **every FDA citation verified verbatim against the live API.**
  This one is fully deterministic, no judge involved, and it is the strongest check here.

The suite is verified to actually fail: gutting the "never volunteer" rule in
`patientSystemPrompt` turns the vague-medication spec red with the leaked quote attached.

Set `RATE_LIMIT_BYPASS_TOKEN` so a re-run doesn't throttle itself.

## Rate limiting

Every model-backed route costs real money — `/api/meds/explain` sends several thousand
tokens of FDA labelling at high effort. Public routes are capped per IP (8 expensive
requests / 10 min, 60 conversational, 200 cheap) with a global per-instance ceiling.

**Caveat:** counters live in process memory, so on serverless each instance keeps its own
and a cold start resets them. That is a real brake on one client hammering one instance,
not a guarantee against a distributed attacker. Move the counters to Vercel KV or Upstash
before this matters — the call sites won't change.

## Adding a case

Copy `lib/cases/pe-okafor.ts`, fill in the fields, register it in `lib/cases/index.ts`.
The rubric is what makes the debrief good — `mustAsk[].why` and `redFlags[].why` are quoted
almost directly at the student, so write them the way an attending would say them.

## Scope

Lumen explains information and simulates fictional patients for training. It does not
diagnose, never tells anyone to start, stop or change a medication, stores no user data,
and is not a substitute for a clinician or pharmacist. **Case content should be reviewed
by a clinician before public launch.**
