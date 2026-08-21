import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, apiErrorResponse, MODEL } from "@/lib/anthropic";
import { LEVELS } from "@/lib/explain";
import { MedsSchema, medsSystemPrompt } from "@/lib/meds";
import { fetchLabel } from "@/lib/openfda";
import { normalise } from "@/lib/rxnorm";
import { checkLimit, EXPENSIVE } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 180;

const Body = z.object({
  level: z.enum(LEVELS).default("some"),
  names: z.array(z.string().min(1).max(200)).min(1).max(15),
});

export async function POST(req: Request) {
  const limited = checkLimit(req, "meds-explain", EXPENSIVE);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Add at least one medication." }, { status: 400 });
  }

  const { level, names } = parsed.data;
  const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  if (unique.length === 0) {
    return Response.json({ error: "Add at least one medication." }, { status: 400 });
  }

  // Resolve names and pull labels in parallel. Every factual claim downstream is
  // grounded in what comes back here — the model gets no interaction database.
  const entries = await Promise.all(
    unique.map(async (input) => {
      const match = await normalise(input);
      const label = await fetchLabel(match.name ?? input);
      return { match, label };
    }),
  );

  const foundCount = entries.filter((e) => e.label.found).length;
  if (foundCount === 0) {
    return Response.json(
      {
        error:
          "None of those names matched an FDA drug label. Check the spelling, or try the generic name printed on the box.",
      },
      { status: 404 },
    );
  }

  try {
    const response = await anthropic.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: medsSystemPrompt(level, entries),
      output_config: { effort: "high", format: zodOutputFormat(MedsSchema) },
      messages: [
        {
          role: "user",
          content: `These are the medicines I take:\n${unique.map((n) => `- ${n}`).join("\n")}\n\nHelp me understand them and anything worth asking about.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return Response.json({ error: "That list couldn't be processed." }, { status: 422 });
    }
    if (!response.parsed_output) {
      return Response.json({ error: "Couldn't work through that list. Try again." }, { status: 502 });
    }

    // Surface the provenance so the UI can show which labels actually backed this.
    return Response.json({
      ...response.parsed_output,
      sources: entries.map((e) => ({
        input: e.match.input,
        resolved: e.match.name,
        matchType: e.match.matchType,
        labelFound: e.label.found,
        hasInteractionSection: Boolean(e.label.interactions),
      })),
    });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
