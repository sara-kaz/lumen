/**
 * RxNorm lookup (NLM RxNav). Free, no key, authoritative for drug naming.
 *
 * Used only to normalise what a person typed or what we read off a box into a
 * canonical drug name — "lipitor" and a misspelt "atorvastatn" both resolve to
 * atorvastatin before we go looking for a label.
 *
 * Note: RxNav's pairwise drug-interaction endpoint was retired and now 404s, so
 * interaction facts come from FDA label text instead. See lib/openfda.ts.
 */

const BASE = "https://rxnav.nlm.nih.gov/REST";
const TIMEOUT_MS = 8000;

export type RxNormMatch = {
  input: string;
  rxcui: string | null;
  name: string | null;
  /** "exact" when the name matched outright, "approximate" when fuzzy-matched. */
  matchType: "exact" | "approximate" | "none";
};

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function normalise(input: string): Promise<RxNormMatch> {
  const term = input.trim();
  if (!term) return { input, rxcui: null, name: null, matchType: "none" };

  const exact = (await getJson(
    `${BASE}/rxcui.json?name=${encodeURIComponent(term)}&search=1`,
  )) as { idGroup?: { rxnormId?: string[] } } | null;

  const exactId = exact?.idGroup?.rxnormId?.[0];
  if (exactId) return { input, rxcui: exactId, name: term, matchType: "exact" };

  // Catches brand names and misspellings — "lipitor", "atorvastatn".
  const approx = (await getJson(
    `${BASE}/approximateTerm.json?term=${encodeURIComponent(term)}&maxEntries=4`,
  )) as {
    approximateGroup?: { candidate?: { rxcui: string; name?: string; score: string }[] };
  } | null;

  const candidates = approx?.approximateGroup?.candidate ?? [];
  // Prefer a candidate that carries a name; bare rxcui rows are less useful downstream.
  const best = candidates.find((c) => c.name) ?? candidates[0];
  if (best) {
    return {
      input,
      rxcui: best.rxcui,
      name: best.name ?? term,
      matchType: "approximate",
    };
  }

  return { input, rxcui: null, name: null, matchType: "none" };
}

export function normaliseAll(inputs: string[]): Promise<RxNormMatch[]> {
  return Promise.all(inputs.map(normalise));
}
