# Recording plan — exactly what to capture

**6 recordings total. 1 on your phone, 5 on the MacBook.**
The other 8 shots are title cards you already have as PNGs in `video-cards/` — nothing
to record for those.

Raw footage will total roughly 8 minutes. The finished video is 2:25. Most of what you
cut is waiting for responses.

---

## 📱 PHONE — 1 recording

### P1 · Photographing the boxes  ·  record ~20s, use ~8s  ·  shot 5

Real-world footage, not a screen recording. Someone else films, or prop the camera.

**In frame:** your hand holding a phone, photographing two real medicine boxes on a
table. Good light. The boxes should be legible for a moment.

**Do:** hold steady on the boxes, raise the phone, tap to capture, lower it.

This is the single most convincing shot in the video. A file picker is not persuasive;
a hand holding a real box is.

> **Continuity note:** the video cuts from your phone here to the MacBook for the
> result. That's a normal edit and viewers accept it — legibility of the FDA citation
> matters more than staying on one device.

---

## 💻 MACBOOK — 5 recordings

Use **⇧⌘5** → Record Selected Portion. Record the browser window only, not the whole
desktop.

### M1 · The search moment  ·  record ~20s, use ~5s  ·  shot 2

Open a search engine, type a symptom like `chest tightness at night`, and slowly scroll
the results. You're capturing the *feeling* of the results page, not any specific
result. Don't linger on anything alarming — a blur or fast scroll is fine.

### M2 · Medications  ·  record ~90s, use ~26s  ·  shots 6, 7, 8

One continuous take on `/meds`:

1. Type `oxybutynin` and `diphenhydramine` (or upload a photo of the boxes)
2. **Confirm screen** — click into a name, edit a character, correct it back
3. Submit, wait
4. Result: scroll to **"Effects that stack up"**
5. Scroll to the **FDA citation block** — then *stop moving* and hold ~10 seconds

**This take contains the most important shot in the video.** Record it twice.

### M3 · Lab results  ·  record ~90s, use ~26s  ·  shots 11, 12, 13

One continuous take on `/labs`:

1. Choose a reader level
2. Paste the sample report below
3. Submit, wait
4. Hold on **"Your results at a glance"** — the counts
5. Scroll to a value, then go back and switch to a different reader level to show the
   explanation change

### M4 · Care  ·  record ~90s, use ~28s  ·  shots 15, 16, 17

One continuous take on `/care`:

1. Type: `Heavy pressure in the middle of my chest for 40 minutes, sweating, spreading
   into my left arm`
2. Age `56`, then **Use my location** (or type `Dearborn, Michigan`)
3. Submit, wait
4. Hold on the **red emergency banner**
5. Scroll to the nearby emergency departments with distances

### M5 · The test suite  ·  record ~180s, use ~10s  ·  shot 18

Terminal, large font. Run:

```
npm run eval
```

Let it complete. You only need the final frame — `30 passed · 0 failed` — plus a few
seconds of specs scrolling past. Speed-ramp the middle in the edit.

---

## Before you press record

**Two real medicine boxes.** Anything you actually have. If they aren't oxybutynin and
diphenhydramine, type whatever they are — Lumen resolves real names either way.

**Browser prep:** new window, hide the bookmarks bar (⇧⌘B), close other tabs, quit
anything that shows notifications. Zoom to 110–125% so text reads on a phone screen.

**Rate limit:** 8 expensive requests per 10 minutes. M2, M3 and M4 each use one per
take. Rehearsing plus recording will trip it — space your takes or you'll hit a 429
mid-record.

**Do one full dry run first** so you know where every scroll lands.

---

## Sample lab report — paste this in M3

```
Haemoglobin        10.2 g/dL      (12.0-15.5)
MCV                74 fL          (80-100)
Ferritin           8 ng/mL        (15-150)
Transferrin sat    9 %            (20-50)
WBC                6.1 x10^9/L    (4.0-11.0)
Platelets          402 x10^9/L    (150-400)
Sodium             139 mmol/L     (135-145)
Potassium          4.1 mmol/L     (3.5-5.1)
Creatinine         0.8 mg/dL      (0.6-1.1)
ALT                22 U/L         (7-56)
TSH                2.4 mIU/L
```

This gives a clean at-a-glance split — several normal, a couple flagged, and one with
no printed range — which is exactly the mix that makes the counts worth showing.

---

## Assembly order

Drop them onto the timeline in this order, cards where marked:

`01-open` → **M1** → `02-brand` → `03-one` → **P1** → **M2** → `06-claim` →
`04-two` → **M3** → `05-three` → **M4** → **M5** → `07-tests` → `08-close`

---

# Screen Studio settings

Screen Studio replaces ⇧⌘5 for all five Mac clips. P1 (the phone in your hand) still
needs a real camera — no screen recorder captures that.

## Before recording

**Record the browser window, not full screen.** Screen Studio zooms into your footage,
so a smaller source gives it room to work without going soft. A 1280×800 window is
ideal.

**Background:** solid dark, or minimal padding. Screen Studio's default is a bright
gradient — that will fight Lumen's dark UI and make the whole thing look cheap. Set the
background to a near-black (`#0b0f14` matches the app) or turn padding down low.

**Cursor:** size around 1.2×, smoothing on, click highlight on but subtle. The default
click animation is quite loud; dial it back.

**Auto-zoom: leave it on for recording**, but plan to override it in the edit. See below.

## The one setting that matters

**Shot 8 — the FDA citation.**

Screen Studio's auto-zoom snaps in on a click and then drifts back out. That is exactly
wrong here: you want it to zoom in and **stay there for ten full seconds** while the
quote sits on screen.

After recording, open the zoom timeline, delete the automatic keyframe over that
section, and add a manual zoom that holds. Everything else in the video can move.
This one holds still.

## In the edit

**Cut the waiting, don't speed it up.** Production calls take 20–40 seconds. Screen
Studio's speed-ramp is smooth, but for a 2:25 video a hard cut straight from "submit"
to "result" reads better than a visible fast-forward. Save the speed ramp for M5, where
watching tests scroll past is actually the point.

**Don't over-zoom.** The default auto-zoom fires on every click and gets nauseating
across two minutes. Keep zooms for: the confirm screen, the FDA citation, the
at-a-glance counts, and the emergency banner. Let everything else sit at full frame.

**Export 1920×1080.** Higher is wasted for a submission and just slows the upload.

## Captions

Screen Studio's text overlays are fine for the short captions in the shot list. If you
find them limiting, export the cut and add captions in CapCut instead — but for
one-line-at-a-time text, Screen Studio alone is enough.

## What Screen Studio does NOT solve

**P1 still needs a real camera.** A hand holding a phone, photographing real boxes.
That's the shot that makes the demo feel like a product rather than a web app, and it
can't be screen-recorded.

If you'd rather stay on one device: mirror your iPhone to the Mac and record the whole
medication flow as a phone screen. You lose the tactile moment but gain continuity.
I'd still film the hand — it's worth the cut.
