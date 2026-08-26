import Anthropic from "@anthropic-ai/sdk";

// Resolves ANTHROPIC_API_KEY (or an `ant auth login` profile) from the environment.
export const anthropic = new Anthropic();

export const MODEL = "claude-opus-5";

/**
 * Maps an SDK error to a user-facing message and status.
 *
 * A 400 can mean "your input was bad" OR "this account is out of credit" — very
 * different problems with very different fixes. Collapsing them into one generic
 * message sends users hunting for a fault in their own file that isn't there.
 */
/**
 * True when the SDK failed because no usable credential was configured, rather than
 * because the request was bad. On a deployment this almost always means the env var
 * was never set, was set to the wrong scope, or was added after the last deploy —
 * Vercel does not apply env changes until you redeploy.
 */
function isMissingCredential(err: unknown): boolean {
  const message = String((err as { message?: string })?.message ?? "");
  return /ANTHROPIC_API_KEY|apiKey|authentication_error|could not resolve authentication/i.test(
    message,
  );
}

export function apiErrorResponse(err: unknown): Response {
  if (err instanceof Anthropic.RateLimitError) {
    return Response.json({ error: "Busy right now — try again in a moment." }, { status: 429 });
  }

  // Checked before the APIError branch: a missing key can surface as a plain Error
  // from the SDK, which would otherwise fall through to an unhelpful generic 500.
  if (isMissingCredential(err)) {
    console.error("Lumen: ANTHROPIC_API_KEY is missing or unusable in this environment.");
    return Response.json(
      { error: "Lumen isn't configured correctly right now. This is on our side, not yours." },
      { status: 503 },
    );
  }

  if (err instanceof Anthropic.APIError) {
    const message = String((err as { message?: string }).message ?? "");

    if (/credit balance is too low|billing/i.test(message)) {
      return Response.json(
        { error: "Lumen is temporarily unavailable. This is on our side, not yours — please try again later." },
        { status: 503 },
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return Response.json(
        { error: "Lumen is temporarily unavailable. This is on our side, not yours." },
        { status: 503 },
      );
    }
    if (err instanceof Anthropic.BadRequestError) {
      return Response.json(
        { error: "That input couldn't be processed. Try a smaller file, or paste the text instead." },
        { status: 400 },
      );
    }
    return Response.json({ error: `Something went wrong (${err.status}).` }, { status: 502 });
  }

  return Response.json({ error: "Something went wrong." }, { status: 500 });
}
