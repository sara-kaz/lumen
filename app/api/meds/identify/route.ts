import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, apiErrorResponse, MODEL } from "@/lib/anthropic";
import { IDENTIFY_SYSTEM, IdentifySchema } from "@/lib/meds";
import { checkLimit, EXPENSIVE } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 120;

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;

/** People photograph a cabinet, not a box — several images per request is the norm. */
const MAX_IMAGES = 6;

const Body = z.object({
  files: z
    .array(
      z.object({
        mediaType: z.enum(IMAGE_TYPES),
        data: z.string().max(11_000_000),
      }),
    )
    .min(1)
    .max(MAX_IMAGES),
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
    return Response.json(
      { error: `Attach between 1 and ${MAX_IMAGES} photos of your medication.` },
      { status: 400 },
    );
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
          // All images in a single request so the model can de-duplicate across
          // photos — the same box often appears twice from different angles.
          content: [
            ...parsed.data.files.map((f) => ({
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: f.mediaType,
                data: f.data,
              },
            })),
            {
              type: "text" as const,
              text:
                parsed.data.files.length === 1
                  ? "What medications can you read in this image?"
                  : `What medications can you read across these ${parsed.data.files.length} images? List each distinct medicine once, even if it appears in more than one photo.`,
            },
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
