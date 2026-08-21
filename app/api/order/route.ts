import { z } from "zod";
import { getCase } from "@/lib/cases";
import { checkLimit, CHEAP } from "@/lib/ratelimit";

export const runtime = "nodejs";

const Body = z.object({ caseId: z.string(), orderId: z.string() });

/**
 * Investigation results are pre-authored in the case file and returned verbatim.
 * The model is deliberately not involved — a hallucinated troponin is worse than no
 * troponin, and the grader needs to know exactly what the student was shown.
 */
export async function POST(req: Request) {
  const limited = checkLimit(req, "order", CHEAP);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const c = getCase(parsed.data.caseId);
  if (!c) return Response.json({ error: "Unknown case" }, { status: 404 });

  const orderable = c.orderables.find((o) => o.id === parsed.data.orderId);
  if (!orderable) {
    return Response.json({ error: "Unknown investigation" }, { status: 404 });
  }

  return Response.json({
    id: orderable.id,
    name: orderable.name,
    result: orderable.result,
    abnormal: orderable.abnormal ?? false,
    costUsd: orderable.costUsd,
    turnaroundMin: orderable.turnaroundMin,
  });
}
