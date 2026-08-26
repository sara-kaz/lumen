import { z } from "zod";
import type { DrugLabel } from "./openfda";
import type { RxNormMatch } from "./rxnorm";
import { LEVEL_COPY, type ExpertiseLevel } from "./explain";

export { LEVEL_COPY };

/** Step one: read the medications off a photo so the person can confirm them. */
export const IdentifySchema = z.object({
  isMedication: z
    .boolean()
    .describe("False if the image shows no medication packaging, label, or pills."),
  notMedicationReason: z
    .string()
    .describe("If isMedication is false, what the image appears to show instead. Otherwise empty."),
  medications: z
    .array(
      z.object({
        name: z
          .string()
          .describe("The drug name exactly as printed — brand or generic, whichever is on the packaging."),
        strength: z.string().describe('Strength as printed, e.g. "5 mg". Empty string if not visible.'),
        form: z.string().describe('Tablet, capsule, syrup, inhaler, patch. Empty string if unclear.'),
        readable: z
          .boolean()
          .describe("False when the name is partly obscured, blurred, or you are guessing at it."),
        note: z
          .string()
          .describe("If readable is false, say what is unclear so the person can correct it. Otherwise empty."),
      }),
    )
    .describe("Every distinct medication visible. Do not guess at text you cannot actually read."),
});

export const MedsSchema = z.object({
  bottomLine: z
    .string()
    .describe("The single most important thing to take away, in one or two sentences. If they read nothing else on the page, this is it. Be direct — no hedging, no preamble, no restating the question."),
  greeting: z.string().describe("Iris's opening line, first person. One or two sentences."),
  medications: z.array(
    z.object({
      name: z.string().describe("The name to show the person — the resolved drug name."),
      asEntered: z.string().describe("What they typed or what was read off the box, if different."),
      recognised: z
        .boolean()
        .describe("False when no FDA label was found for this drug. Say so rather than improvising."),
      whatItIsFor: z
        .string()
        .describe("What this medicine is generally used for, from the label's indications. Plain language for the reader's level. Never assert why THIS person takes it."),
      goodToKnow: z
        .string()
        .describe("One or two practical points from the label — with food, drowsiness, sun sensitivity. General, never a personalised dose instruction."),
    }),
  ),
  interactionFindings: z
    .array(
      z.object({
        involves: z.array(z.string()).describe("The drugs on this person's list that this concerns."),
        headline: z.string().describe("Plain-language summary of the concern, no clinical grading."),
        whatHappens: z.string().describe("What the label says can happen when these are combined."),
        sourceDrug: z
          .string()
          .describe("Whose FDA label this came from — use the simple drug name as the person listed it (\"oxybutynin\"), never the label's full product title (\"Oxybutynin chloride extended-release tablets\")."),
        sourceQuote: z
          .string()
          .describe("A VERBATIM sentence or clause from the label text you were given. Never paraphrase here and never write one from memory."),
      }),
    )
    .describe("Only findings you can support with a quote from the supplied label text. Empty array if none."),
  overlappingEffects: z
    .array(
      z.object({
        effect: z.string().describe('The shared effect, e.g. "drowsiness", "drying effects", "bleeding risk".'),
        contributors: z.array(z.string()).describe("Which of their drugs contribute."),
        why: z.string().describe("Why stacking these matters, in plain language."),
      }),
    )
    .describe("Additive effects across several drugs. Often the most useful thing here — two mild sedatives nobody counted together. Empty array if none."),
  notCovered: z
    .array(z.string())
    .describe("Drugs where no label or no interaction section was available, so nothing could be checked. Be explicit."),
  questionsForPharmacist: z
    .array(z.string())
    .describe("Three to six specific questions grounded in this actual list, ready to read aloud."),
  urgency: z
    .enum(["routine", "ask_soon", "ask_promptly"])
    .describe("routine: nothing here needs urgent attention. ask_soon: worth raising at the next opportunity. ask_promptly: a combination serious enough to speak to a pharmacist or doctor today."),
  urgencyReason: z.string().describe("One or two sentences naming the combination behind the level."),
  closing: z.string().describe("Iris's sign-off, first person. Point them at a pharmacist as the real check."),
});

export type MedsExplanation = z.infer<typeof MedsSchema>;
export type Identification = z.infer<typeof IdentifySchema>;

export const IDENTIFY_SYSTEM = `You read medication names off photographs of packaging, labels, and pill bottles.

Transcribe only what is actually legible. If a name is blurred, partly hidden, or you find yourself inferring it from context, set readable to false and say what is unclear — a person acting on a misread drug name is the failure that matters here, and an honest "I can't read this" is always better than a confident guess.

Read the drug NAME, not the pharmacy's patient name or address. Ignore any personal details on a dispensing label; you only need the medicine.

If several medicines are visible, list each one separately. When you are given more than one image, treat them as one collection: the same box often appears in two photos from different angles, so list each distinct medicine ONCE rather than once per image. If the image shows loose pills with no packaging, you generally cannot identify them from appearance alone — set isMedication true but return an empty medications array and explain in notMedicationReason that loose tablets can't be identified safely from a photo.`;

const LEVEL_INSTRUCTIONS: Record<ExpertiseLevel, string> = {
  none: `The reader has NO medical background. Everyday words only. If a term is printed on their box and unavoidable, translate it immediately. Short sentences. Never use "contraindicated", "potentiate", "adverse event", "concomitant" or "efficacy".`,
  some: `The reader has picked up some medical vocabulary from their own health or a family member's. Common terms are fine; define anything specialised the first time. Give a little mechanism.`,
  informed: `The reader is comfortable with medical terminology. Use it directly, go deeper on mechanism, and name the pharmacology where it helps. The boundary against advice matters MORE with this reader, not less — they are the most likely to act on an overstep.`,
};

export function medsSystemPrompt(
  level: ExpertiseLevel,
  entries: { match: RxNormMatch; label: DrugLabel }[],
): string {
  const evidence = entries
    .map(({ match, label }) => {
      if (!label.found) {
        return `### ${match.input}\nNo FDA label found for this name. You know nothing about this drug from the source data — say so.`;
      }
      return `### ${match.input}${match.name && match.name !== match.input ? ` (resolved to ${match.name})` : ""}
Brand: ${label.brandName ?? "—"} | Generic: ${label.genericName ?? "—"}

INDICATIONS:
${label.indications ?? "(not present on this label)"}

DRUG INTERACTIONS:
${label.interactions ?? "(no interactions section on this label — common for over-the-counter products)"}

WARNINGS:
${label.warnings ?? "(not present on this label)"}

CONTRAINDICATIONS:
${label.contraindications ?? "(not present on this label)"}`;
    })
    .join("\n\n---\n\n");

  return `You are Iris, the guide who helps people understand their medications.

# Who you are
Calm, warm, unhurried, and completely unflappable. You speak in the first person — "I'll walk you through these". The interface already labels you, so you never need to name yourself. Outside the greeting and closing, drop the personality and just explain clearly.

# Who you are talking to
${LEVEL_INSTRUCTIONS[level]}

# Your evidence — this is the ONLY source you may use for factual claims
Below is the official FDA labelling retrieved for each medicine on this person's list.

${evidence}

# Hard rules
1. NEVER tell anyone to start, stop, change, split, skip, or adjust the timing of a medication. Not even "you might want to take this at night instead". That is a prescriber's decision and you do not have their chart.
2. NEVER give a personalised dose. You may state general label information; you may not tell this person what to take.
3. EVERY entry in interactionFindings must be supported by a VERBATIM quote from the label text above, placed in sourceQuote. If you cannot find a supporting sentence in the supplied text, the finding does not go in the list. Do not write interactions from memory — you have no interaction database, only these labels.
4. Never diagnose. Do not infer what condition someone has from what they take. A drug can be prescribed for several reasons, and guessing is both wrong and intrusive. Say what the medicine is generally FOR, never what they have.
5. If a drug returned no label, or its label has no interactions section, list it in notCovered and say plainly that nothing could be checked for it. Silence there would read as "all clear", which would be a lie.
6. Be honest about the limits of this check. You are reading individual labels, not running a pairwise interaction database — the labels themselves are the only source. A pharmacist has the full picture and you do not.
7. overlappingEffects is often the most valuable section. Look for additive burdens the person would never spot: several drugs that each cause drowsiness, several with drying anticholinergic effects, several that raise bleeding risk. Name the stack even when no single label calls it an interaction.
8. Calibrate the register. Do not alarm someone about a routine combination millions of people take safely. Do not soften a genuinely serious one.
9. Address the reader as "you".

# The short version
bottomLine is the one thing that must land: whether anything on this list is worth raising, and what. If nothing stands out, say that plainly rather than padding it.

# Urgency
"ask_promptly" is for a combination the labels treat as seriously as a contraindication or a major risk. "ask_soon" is for something worth raising but not urgent. "routine" is for a list with nothing notable. Every level ends with the pharmacist, not with you.`;
}
