# Lumen — demo video, caption-only edit

No voiceover needed. Title cards cut between screen clips; captions overlay the
footage. Target 2:15–2:30. Cards are 1920×1080 PNGs in `video-cards/`.

**Rule for every caption: one line, max ~8 words, on screen at least 2.5 seconds.**
If you can't read it aloud in the time it's up, it's too long.

---

## Shot list

| # | Time | What's on screen | Caption / card |
|---|---|---|---|
| 1 | 0:00–0:05 | **CARD 01-open** | *It's 2:47am and something hurts.* |
| 2 | 0:05–0:10 | Screen: a search results page, scrolling | `You search it.` → `The third result has the word you were afraid of.` |
| 3 | 0:10–0:14 | **CARD 02-brand** | — |
| 4 | 0:14–0:18 | **CARD 03-one** | — |
| 5 | 0:18–0:26 | **Phone footage:** your hand photographing two real medicine boxes | `Point your camera at what's in the cabinet.` |
| 6 | 0:26–0:33 | Screen: the confirm step, editing a name | `It reads them back and asks you to check.` → `A misread name would make everything after it wrong.` |
| 7 | 0:33–0:42 | Screen: result — scroll to "Effects that stack up" | `Two of these do the same thing to you.` → `No single label calls it an interaction.` |
| 8 | 0:42–0:52 | **Screen: the FDA citation block. HOLD STILL. Zoom in.** | `Here's the sentence it came from.` |
| 9 | 0:52–0:56 | **CARD 06-claim** | — |
| 10 | 0:56–1:00 | **CARD 04-two** | — |
| 11 | 1:00–1:08 | Screen: paste a lab report, hit explain | `Paste what the portal gave you.` |
| 12 | 1:08–1:18 | Screen: the at-a-glance tally. Hold on the counts. | `12 were completely normal.` → `Nobody ever tells you that part.` |
| 13 | 1:18–1:26 | Screen: switch reader level, show a value change | `Choose how much you already know.` |
| 14 | 1:26–1:30 | **CARD 05-three** | — |
| 15 | 1:30–1:40 | Screen: type chest-pain symptoms, submit | `Describe what you're feeling.` |
| 16 | 1:40–1:50 | Screen: the red emergency banner | `It won't tell you what you have.` → `It tells you what to do.` |
| 17 | 1:50–1:58 | Screen: scroll to real nearby ERs with distances | `And where to actually go. Real map data.` |
| 18 | 1:58–2:08 | Terminal: `npm run eval` → 30 passed | `30 automated tests.` |
| 19 | 2:08–2:16 | **CARD 07-tests** | — |
| 20 | 2:16–2:25 | **CARD 08-close** | — |

---

## The one shot that matters

**Shot 8 — the FDA citation.** Stop moving. Zoom in. Hold it for a full ten seconds
with a single caption. This is the moment a judge realises it isn't a wrapper. Every
other shot can be tightened; do not tighten this one.

## Recording notes

- **⇧⌘5** for screen capture on macOS. Record the browser at 1280×800 or larger.
- **Film shot 5 on a real phone** with real boxes. A file picker is not convincing;
  a hand holding a box is.
- **Cut the waiting.** Production calls take 20–40 seconds. Record them, then speed-ramp
  or hard-cut the dead air — never leave a spinner on screen.
- **Rate limit:** 8 expensive requests per 10 minutes. Space your takes or you'll get
  a 429 mid-record.
- Do a full dry run first so you know where every scroll lands.

## Caption styling

- Bottom third, large, high contrast. White on a dark translucent bar.
- Card text is already styled — don't add captions on top of the cards.
- No transitions beyond hard cuts and the occasional 200ms fade. Anything fancier
  reads as filler.

## If you decide to add voice later

Record the screen first, then narrate over the finished cut. Never narrate live while
clicking — you'll sound like you're hunting for a button, because you will be.
