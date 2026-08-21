/**
 * openFDA drug labelling. Free, no key, and the source of every interaction claim
 * this product makes.
 *
 * The model is never asked what interacts with what. It is handed the actual label
 * text retrieved here and asked which parts of it apply to the other drugs on the
 * person's list — and it must quote the sentence it relied on. A drug interaction
 * invented from model recall is exactly the failure that would hurt someone.
 */

const BASE = "https://api.fda.gov/drug/label.json";
const TIMEOUT_MS = 10000;

/** Labels are long; this keeps the grounded prompt within a sane budget. */
const MAX_SECTION_CHARS = 6000;

export type DrugLabel = {
  query: string;
  found: boolean;
  brandName: string | null;
  genericName: string | null;
  interactions: string | null;
  warnings: string | null;
  indications: string | null;
  contraindications: string | null;
};

const EMPTY = (query: string): DrugLabel => ({
  query,
  found: false,
  brandName: null,
  genericName: null,
  interactions: null,
  warnings: null,
  indications: null,
  contraindications: null,
});

function clip(value: string[] | undefined): string | null {
  if (!value?.length) return null;
  const joined = value.join("\n\n").replace(/\s+/g, " ").trim();
  return joined ? joined.slice(0, MAX_SECTION_CHARS) : null;
}

async function query(searchExpr: string): Promise<Record<string, string[] | undefined> | null> {
  try {
    const res = await fetch(`${BASE}?search=${encodeURIComponent(searchExpr)}&limit=1`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null; // 404 simply means no label matched.
    const data = (await res.json()) as { results?: Record<string, string[] | undefined>[] };
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function fetchLabel(drugName: string): Promise<DrugLabel> {
  const name = drugName.trim();
  if (!name) return EMPTY(drugName);

  // Generic first — it is the more stable identifier — then brand, then a loose match.
  const result =
    (await query(`openfda.generic_name:"${name}"`)) ??
    (await query(`openfda.brand_name:"${name}"`)) ??
    (await query(`openfda.substance_name:"${name}"`));

  if (!result) return EMPTY(drugName);

  const openfda = (result.openfda ?? {}) as unknown as {
    brand_name?: string[];
    generic_name?: string[];
  };

  return {
    query: drugName,
    found: true,
    brandName: openfda.brand_name?.[0] ?? null,
    genericName: openfda.generic_name?.[0] ?? null,
    // Prescription labels carry drug_interactions; many OTC labels carry only a
    // short warnings block, so fall through rather than reporting nothing.
    interactions: clip(result.drug_interactions),
    warnings: clip(result.warnings_and_cautions) ?? clip(result.warnings),
    indications: clip(result.indications_and_usage) ?? clip(result.purpose),
    contraindications: clip(result.contraindications),
  };
}

export function fetchLabels(names: string[]): Promise<DrugLabel[]> {
  return Promise.all(names.map(fetchLabel));
}
