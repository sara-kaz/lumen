import { z } from "zod";
import { geocode } from "@/lib/geocode";
import { checkLimit, type Limit } from "@/lib/ratelimit";

export const runtime = "nodejs";

/** No model involved, but it fronts a third party that asks for restraint. */
const GEOCODE: Limit = { requests: 20, windowMs: 10 * 60_000 };

const Body = z.object({ query: z.string().min(2).max(200) });

export async function POST(req: Request) {
  const limited = checkLimit(req, "geocode", GEOCODE);
  if (limited) return limited;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Type a town, city or postcode." }, { status: 400 });
  }

  const results = await geocode(parsed.data.query);
  if (results.length === 0) {
    return Response.json(
      { error: "Couldn't find that place. Try adding the country — for example “48126, USA”." },
      { status: 404 },
    );
  }
  return Response.json({ results });
}
