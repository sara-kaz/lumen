import { MODEL } from "@/lib/anthropic";
import { storeConfigured } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment diagnostics. Reports the SHAPE of the credential, never any part of its
 * value — presence, length, and whether it carries the expected prefix is enough to
 * distinguish "never set" from "set with quotes" from "set but truncated", which are
 * the three ways this actually goes wrong on a platform env var.
 */
export async function GET() {
  const raw = process.env.ANTHROPIC_API_KEY;

  const key = {
    present: typeof raw === "string" && raw.length > 0,
    length: raw?.length ?? 0,
    hasExpectedPrefix: raw?.startsWith("sk-ant-") ?? false,
    // The three classic paste mistakes, each of which produces a different failure.
    hasSurroundingQuotes: Boolean(raw && /^["'].*["']$/.test(raw)),
    hasWhitespace: Boolean(raw && raw !== raw.trim()),
  };

  return Response.json({
    ok: key.present && key.hasExpectedPrefix && !key.hasSurroundingQuotes && !key.hasWhitespace,
    model: MODEL,
    key,
    feedbackStore: storeConfigured() ? "configured" : "log-only (not durable)",
    // Confirms which build is actually serving traffic.
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "local",
    region: process.env.VERCEL_REGION ?? "local",
  });
}
