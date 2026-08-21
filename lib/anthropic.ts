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
export function apiErrorResponse(err: unknown): Response {
  if (err instanceof Anthropic.RateLimitError) {
    return Response.json({ error: "Busy right now — try again in a moment." }, { status: 429 });
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
