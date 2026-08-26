/**
 * Durable feedback storage.
 *
 * Uses a Redis REST endpoint when one is configured (Vercel KV / Upstash both inject
 * the env vars below), and falls back to the platform log otherwise. The fallback is
 * NOT durable — platform runtime logs are short-lived and are not a datastore — so
 * configure the store before you rely on having a record.
 */

const URL_VAR = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_VAR = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const KEY = "lumen:feedback";

export function storeConfigured(): boolean {
  return Boolean(URL_VAR && TOKEN_VAR);
}

async function command(args: (string | number)[]): Promise<unknown | null> {
  if (!storeConfigured()) return null;
  try {
    const res = await fetch(URL_VAR!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN_VAR}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    return data.result ?? null;
  } catch {
    return null;
  }
}

export type FeedbackEntry = {
  helpful: "yes" | "no";
  tool: string;
  message?: string;
  contact?: string;
  at: string;
};

/** Returns true when the entry was durably stored, false when only logged. */
export async function appendFeedback(entry: FeedbackEntry): Promise<boolean> {
  const line = JSON.stringify(entry);

  // Always log — cheap, and it means a misconfigured store still leaves a trace.
  console.log("LUMEN_FEEDBACK " + line);

  const result = await command(["LPUSH", KEY, line]);
  return result !== null;
}

export async function readFeedback(limit = 500): Promise<FeedbackEntry[]> {
  const result = await command(["LRANGE", KEY, 0, limit - 1]);
  if (!Array.isArray(result)) return [];
  return result.flatMap((row) => {
    try {
      return [JSON.parse(String(row)) as FeedbackEntry];
    } catch {
      return [];
    }
  });
}
