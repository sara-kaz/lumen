/**
 * Place-name → coordinates via Nominatim (OpenStreetMap). Free, no key.
 *
 * Exists because a large share of people decline the browser location prompt, or have
 * it blocked at the OS or browser level, and "no nearby care" is a poor answer to
 * someone trying to decide whether to go to hospital.
 *
 * Nominatim asks clients to identify themselves and to stay under roughly one request
 * per second; the route in front of this is rate limited accordingly.
 */

const ENDPOINT = "https://nominatim.openstreetmap.org/search";
const TIMEOUT_MS = 12_000;

const HEADERS = {
  Accept: "application/json",
  "User-Agent": "Lumen/1.0 (health information tool; +https://github.com/sara-kaz/lumen)",
};

export type GeocodeResult = {
  lat: number;
  lon: number;
  /** Shown back to the user to confirm — a bare postcode can resolve to another country. */
  displayName: string;
};

export async function geocode(query: string): Promise<GeocodeResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = `${ENDPOINT}?q=${encodeURIComponent(q)}&format=json&limit=4&addressdetails=0`;
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return [];
    const data = (await res.json()) as { lat: string; lon: string; display_name: string }[];
    return data
      .map((r) => ({
        lat: Number(r.lat),
        lon: Number(r.lon),
        displayName: r.display_name,
      }))
      .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon));
  } catch {
    return [];
  }
}
