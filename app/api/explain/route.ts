import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, apiErrorResponse, MODEL } from "@/lib/anthropic";
import { explainSystemPrompt, ExplainSchema, LEVELS } from "@/lib/explain";
import { checkLimit, EXPENSIVE } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 180;

const ALLOWED_MEDIA = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

/** ~8 MB of decoded payload. The API ceiling is far higher; this is a sanity bound. */
const MAX_BASE64_CHARS = 11_000_000;

const Body = z
  .object({
    level: z.enum(LEVELS).default("some"),
    text: z.string().max(60_000).optional(),
    file: z
      .object({
        mediaType: z.enum(ALLOWED_MEDIA),
        data: z.string().max(MAX_BASE64_CHARS),
        name: z.string().max(300).optional(),
      })
      .optional(),
  })
  .refine((b) => (b.text && b.text.trim().length > 0) || b.file, {
    message: "Provide either pasted text or a file.",
  });

export async function POST(req: Request) {
  const limited = checkLimit(req, "explain", EXPENSIVE);
  if (limited) return limited;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Paste your results or attach the report file." },
      { status: 400 },
    );
  }

  const { text, file, level } = parsed.data;
  const content: Anthropic.ContentBlockParam[] = [];

  // Documents and images go before the instruction text — the model attends to them
  // better in that order.
  if (file) {
    if (file.mediaType === "application/pdf") {
      content.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: file.data },
      });
    } else {
      content.push({
        type: "image",
        source: { type: "base64", media_type: file.mediaType, data: file.data },
      });
    }
  }

  content.push({
    type: "text",
    text: text?.trim()
      ? `Here are my results:\n\n${text.trim()}\n\nExplain this report to me.`
      : "Explain this report to me.",
  });

  try {
    const response = await anthropic.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      system: explainSystemPrompt(level),
      // Transcribing values correctly matters more than latency here. A misread
      // decimal place is the failure mode that would actually hurt someone.
      output_config: {
        effort: "high",
        format: zodOutputFormat(ExplainSchema),
      },
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") {
      return Response.json(
        { error: "This document couldn't be processed. Try a different file." },
        { status: 422 },
      );
    }

    if (!response.parsed_output) {
      return Response.json(
        { error: "Couldn't read that report. Try pasting the values as text instead." },
        { status: 502 },
      );
    }

    return Response.json(response.parsed_output);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
