### The drug interaction API I planned the whole feature around was dead

I checked NLM's RxNav interaction endpoint before writing code against it. It returned **404** — it had been retired, and there is no free curated pairwise interaction database left.

The tempting fix was to just ask the model. It would have demoed fine and been right most of the time. But a fabricated interaction is invisible — it reads exactly like a real one, and someone might stop taking a medication over it.

So I inverted the architecture: **RxNorm** normalises the drug name, **openFDA** returns the actual label text, and the model receives only that retrieved text — then must **quote verbatim** the sentence it relied on. No supporting sentence, no claim.

The dead API forced a better product. Because labels are per-drug rather than pairwise, Lumen also can't imply it checked everything, so it now says so explicitly: *"neither label names the other — please don't read that as a clearance."*

### My own safety rule turned out to be wrong

I wrote a rule: if no reference range is printed, mark the value `unknown` rather than inventing one.

Then I fed it a potassium of 7.2 with no printed range — a genuinely dangerous value. The model marked it **high** anyway, overriding me, and escalated to urgent care.

It was right and my rule was wrong. I'd conflated two different obligations: *displaying a fabricated range* (never acceptable) and *classifying a value* (necessary for safety). Marking 7.2 as "unknown" would have hidden it. I split the rule so the safe behaviour is now specified rather than lucky.

### My safety check cried wolf

The eval that verifies FDA citations started reporting `FABRICATED QUOTE`. Alarming — until I looked. The quote *was* verbatim; the model had cited the label's full product title, so my lookup couldn't retrieve anything to compare against. My code reported "couldn't check" as **"fabricated."**

That's worse than the bug it was hunting. A safety check that cries wolf gets ignored, which is exactly when it catches something real. It now returns a three-way verdict: `ok`, `mismatch` (retrieved and absent — a real failure), or `unchecked` (nothing proven either way).

### A missing header silently broke the emergency path

Nearby-hospital lookup returned zero results in production while working perfectly from curl. Overpass returns **406** to clients that don't identify themselves, and Node's `fetch` sends no `User-Agent` by default.

It failed silently — no error, just an empty list on the screen where someone in an emergency needs an address. Fixed with a proper User-Agent and a mirror fallback.

### I claimed to be capturing feedback when I wasn't

I logged user feedback with `console.log`, called it captured, and moved on. Platform runtime logs are short-lived and are not a datastore — so there was no durable record at all.

Replaced with a Redis-backed store, a token-gated read endpoint that fails **closed** (people leave health context and emails in there), and a status field in `/api/health` so the system reports its own configuration honestly instead of losing data quietly.
