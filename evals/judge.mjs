import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const client = new Anthropic();

const Verdict = z.object({
  disclosed: z
    .boolean()
    .describe("True only if the reply actually conveys the fact to the reader."),
  quote: z
    .string()
    .describe("The words that convey it, or an empty string if it is absent."),
});

/**
 * Semantic assertion. Keyword matching is too brittle here — a patient can disclose a
 * flight as "I was in the air for fourteen hours" with no matching substring, and can
 * mention the word "clot" while denying knowledge of one.
 */
export async function conveys(reply, fact) {
  const res = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 1000,
    output_config: { effort: "low", format: zodOutputFormat(Verdict) },
    system:
      "You check whether a simulated patient's reply conveys a specific fact to the listener. " +
      "Judge only what the reply actually communicates. A denial, a hedge, or an unrelated " +
      "mention of the same words does not count as disclosure. Be strict and literal.",
    messages: [
      {
        role: "user",
        content: `FACT: ${fact}\n\nPATIENT REPLY:\n"""${reply}"""\n\nDoes the reply convey that fact?`,
      },
    ],
  });
  return res.parsed_output ?? { disclosed: false, quote: "" };
}
