import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, apiErrorResponse, MODEL } from "@/lib/anthropic";
import { getCase } from "@/lib/cases";
import { encounterSummary, graderSystemPrompt } from "@/lib/prompts";
import { checkLimit, EXPENSIVE } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 120;

const DebriefSchema = z.object({
  mentorNote: z
    .string()
    .describe("Dr. Ellis speaking directly to the student, before any score is shown. Two or three sentences, honest and warm."),
  headline: z
    .string()
    .describe("One sentence, second person, summarising how the encounter went."),
  overallScore: z.number().min(0).max(100),
  historyScore: z.number().min(0).max(100),
  investigationScore: z.number().min(0).max(100),
  reasoningScore: z.number().min(0).max(100),
  diagnosisVerdict: z.enum(["correct", "partial", "incorrect"]),
  diagnosisComment: z
    .string()
    .describe("What they concluded, and how it compares to the actual diagnosis."),
  historyItems: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        asked: z.boolean(),
        comment: z
          .string()
          .describe(
            "If asked, quote or paraphrase how they asked it. If not, say what they should have asked.",
          ),
      }),
    )
    .describe("One entry for every item in the expected history, asked or not."),
  whatYouDidWell: z
    .array(z.string())
    .describe("Genuine positives, referencing what the student actually did. Empty array only if there is truly nothing to credit."),
  whatYouMissed: z
    .array(
      z.object({
        title: z.string(),
        consequence: z
          .string()
          .describe("The clinical consequence of having missed this, in this patient."),
      }),
    )
    .describe("Empty array if they missed nothing significant."),
  overOrdered: z
    .array(z.object({ name: z.string(), why: z.string() }))
    .describe("Investigations ordered that were not indicated. Empty array if none."),
  underOrdered: z
    .array(z.object({ name: z.string(), why: z.string() }))
    .describe("Indicated investigations they never ordered. Empty array if none."),
  managementFeedback: z
    .string()
    .describe("Assessment of their plan against the key management points."),
  nextStep: z
    .string()
    .describe("One concrete thing to work on before the next case."),
});

const Body = z.object({
  caseId: z.string(),
  messages: z.array(
    z.object({ role: z.enum(["user", "assistant"]), content: z.string() }),
  ),
  orderedIds: z.array(z.string()),
  differential: z.string().min(1).max(4000),
  plan: z.string().max(4000),
});

export async function POST(req: Request) {
  const limited = checkLimit(req, "grade", EXPENSIVE);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { caseId, messages, orderedIds, differential, plan } = parsed.data;
  const c = getCase(caseId);
  if (!c) return Response.json({ error: "Unknown case" }, { status: 404 });

  try {
    const response = await anthropic.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: graderSystemPrompt(c),
      // Grading is the part that has to be right — this is where the effort belongs.
      output_config: {
        effort: "high",
        format: zodOutputFormat(DebriefSchema),
      },
      messages: [
        {
          role: "user",
          content: `${encounterSummary(messages, orderedIds, c)}

## The student's differential diagnosis
${differential}

## The student's management plan
${plan || "(the student did not submit a plan)"}

Grade this encounter.`,
        },
      ],
    });

    if (!response.parsed_output) {
      return Response.json({ error: "Could not grade this encounter." }, { status: 502 });
    }

    return Response.json(response.parsed_output);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
