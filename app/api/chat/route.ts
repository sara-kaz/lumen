import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { anthropic, MODEL } from "@/lib/anthropic";
import { getCase } from "@/lib/cases";
import { patientSystemPrompt } from "@/lib/prompts";
import { checkLimit, CONVERSATIONAL } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  caseId: z.string(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(200),
});

export async function POST(req: Request) {
  const limited = checkLimit(req, "chat", CONVERSATIONAL);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { caseId, messages } = parsed.data;
  const c = getCase(caseId);
  if (!c) return Response.json({ error: "Unknown case" }, { status: 404 });

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 2000,
    // The system prompt is large, identical on every turn of an encounter, and
    // re-sent each time — cache it so only the new dialogue is billed at full rate.
    system: [
      {
        type: "text",
        text: patientSystemPrompt(c),
        cache_control: { type: "ephemeral" },
      },
    ],
    // Staying in character as a patient is not a reasoning-heavy task, and low
    // effort keeps replies snappy enough to feel like a conversation.
    output_config: { effort: "low" },
    messages: messages as Anthropic.MessageParam[],
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\n[The simulation stopped this response. Try rephrasing your question.]",
            ),
          );
        }
      } catch (err) {
        const raw = String((err as { message?: string })?.message ?? "");
        const message = /ANTHROPIC_API_KEY|apiKey|authentication/i.test(raw)
          ? "[Lumen isn't configured correctly right now. This is on our side, not yours.]"
          : err instanceof Anthropic.APIError
            ? `[Simulation error ${err.status}. Try again.]`
            : "[Simulation error. Try again.]";
        controller.enqueue(encoder.encode(`\n\n${message}`));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
