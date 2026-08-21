import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, apiErrorResponse, MODEL } from "@/lib/anthropic";
import { checkLimit, EXPENSIVE } from "@/lib/ratelimit";
import { findCare } from "@/lib/places";
import { TRIAGE_SYSTEM, TriageSchema } from "@/lib/triage";

export const runtime = "nodejs";
export const maxDuration = 180;

const Body = z.object({
  symptoms: z.string().min(3).max(4000),
  age: z.string().max(20).optional(),
  context: z.string().max(2000).optional(),
  // Optional — the person may decline to share location and still get triaged.
  coords: z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) }).optional(),
});

export async function POST(req: Request) {
  const limited = checkLimit(req, "triage", EXPENSIVE);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Tell me what's going on and I'll help you work out where to go." }, { status: 400 });
  }

  const { symptoms, age, context, coords } = parsed.data;

  try {
    const response = await anthropic.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: TRIAGE_SYSTEM,
      // Getting the acuity wrong in either direction is the failure mode here.
      output_config: { effort: "high", format: zodOutputFormat(TriageSchema) },
      messages: [
        {
          role: "user",
          content: [
            age ? `Age: ${age}` : null,
            `What's going on: ${symptoms}`,
            context ? `Other things worth knowing: ${context}` : null,
            "\nWhat should I do, and where should I go?",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json(
        {
          error:
            "I couldn't work through that. If you're worried about your symptoms right now, contact your local emergency number or urgent care service directly.",
        },
        { status: 502 },
      );
    }

    const triage = response.parsed_output;

    // Locations are looked up from real map data, never generated. Someone in an
    // emergency must not be sent to a hospital that does not exist.
    const places =
      coords && triage.careType !== "none" && !triage.crisisSupport
        ? await findCare(triage.careType, coords.lat, coords.lon)
        : [];

    return Response.json({ ...triage, places, locationUsed: Boolean(coords) });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
