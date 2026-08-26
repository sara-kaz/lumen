import { z } from "zod";
import { checkLimit, type Limit } from "@/lib/ratelimit";

export const runtime = "nodejs";

const FEEDBACK: Limit = { requests: 5, windowMs: 60 * 60_000 };

const Body = z.object({
  helpful: z.enum(["yes", "no"]),
  tool: z.enum(["meds", "labs", "care", "cases", "other"]),
  message: z.string().max(2000).optional(),
  contact: z.string().max(200).optional(),
});

/**
 * Feedback capture without a database.
 *
 * Structured JSON to the platform log, which is searchable and retained — enough to
 * evidence real usage and read what people actually said, without standing up
 * storage for a launch window. Move to a real store if this outlives the launch.
 */
export async function POST(req: Request) {
  const limited = checkLimit(req, "feedback", FEEDBACK);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Couldn't send that." }, { status: 400 });
  }

  console.log(
    "LUMEN_FEEDBACK " +
      JSON.stringify({ ...parsed.data, at: new Date().toISOString() }),
  );

  return Response.json({ ok: true });
}
