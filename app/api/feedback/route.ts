import { z } from "zod";
import { checkLimit, type Limit } from "@/lib/ratelimit";
import { appendFeedback, readFeedback, storeConfigured } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEEDBACK: Limit = { requests: 5, windowMs: 60 * 60_000 };

const Body = z.object({
  helpful: z.enum(["yes", "no"]),
  tool: z.enum(["meds", "labs", "care", "cases", "other"]),
  message: z.string().max(2000).optional(),
  contact: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const limited = checkLimit(req, "feedback", FEEDBACK);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Couldn't send that." }, { status: 400 });
  }

  const stored = await appendFeedback({ ...parsed.data, at: new Date().toISOString() });
  return Response.json({ ok: true, stored });
}

/**
 * Read back collected feedback. Gated on a secret and fails CLOSED — if ADMIN_TOKEN
 * is unset the endpoint is disabled entirely rather than open, because people leave
 * free-text health context and an email address in here.
 */
export async function GET(req: Request) {
  const secret = process.env.ADMIN_TOKEN;
  if (!secret) {
    return Response.json({ error: "Not available." }, { status: 404 });
  }
  if (new URL(req.url).searchParams.get("token") !== secret) {
    return Response.json({ error: "Not available." }, { status: 404 });
  }

  const entries = await readFeedback();
  return Response.json({
    storeConfigured: storeConfigured(),
    total: entries.length,
    helpful: entries.filter((e) => e.helpful === "yes").length,
    notHelpful: entries.filter((e) => e.helpful === "no").length,
    withComment: entries.filter((e) => e.message?.trim()).length,
    entries,
  });
}
