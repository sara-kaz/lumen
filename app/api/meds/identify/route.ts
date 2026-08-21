import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, apiErrorResponse, MODEL } from "@/lib/anthropic";
import { IDENTIFY_SYSTEM, IdentifySchema } from "@/lib/meds";
import { checkLimit, EXPENSIVE } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 120;

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;

const Body = z.object({
  file: z.object({
    mediaType: z.enum(IMAGE_TYPES),
    data: z.string().max(11_000_000),
  }),
});

/**
 * Step one of two. The photo is only ever used to produce a list the person then
 * confirms — a misread drug name must never flow straight into an interaction check.
 */
export async function POST(req: Request) {
  const limited = checkLimit(req, "meds-identify", EXPENSIVE);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Attach a photo of the medication." }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      system: IDENTIFY_SYSTEM,
      output_config: { effort: "high", format: zodOutputFormat(IdentifySchema) },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: parsed.data.file.mediaType,
                data: parsed.data.file.data,
              },
            },
            { type: "text", text: "What medications can you read in this image?" },
          ],
        },
      ],
    });

    if (!response.parsed_output) {
      return Response.json({ error: "Couldn't read that image. Try typing the names instead." }, { status: 502 });
    }
    return Response.json(response.parsed_output);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
