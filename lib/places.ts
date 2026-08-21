/**
 * Care locations from OpenStreetMap via the Overpass API. Free, no key.
 *
 * Locations are looked up from coordinates the user chooses to share and are never
 * stored. The model does not generate addresses — a hallucinated hospital is a person
 * driving somewhere that does not exist while having a heart attack.
 */

/** Primary, then a mirror. Public Overpass instances go down or throttle regularly. */
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const TIMEOUT_MS = 25_000;

/**
 * Overpass returns 406 to clients that do not identify themselves — Node's fetch
 * sends no User-Agent by default, so this header is required, not merely polite.
 */
const HEADERS = {
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "application/json",
  "User-Agent": "Lumen/1.0 (health information tool; +https://github.com/sara-kaz/lumen)",
};

async function overpass(query: string): Promise<Element[] | null> {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: HEADERS,
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as { elements?: Element[] };
      return data.elements ?? [];
    } catch {
      /* fall through to the mirror */
    }
  }
  return null;
}

export type CareType =
  | "emergency_department"
  | "urgent_care"
  | "primary_care"
  | "pharmacy"
  | "none";

export type Place = {
  name: string;
  kind: string;
  lat: number;
  lon: number;
  distanceKm: number;
  hasEmergency: boolean;
  openingHours: string | null;
  phone: string | null;
  address: string | null;
  mapUrl: string;
};

type Element = {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

/** Overpass filters per care type, ordered widest-useful-first. */
const QUERIES: Record<Exclude<CareType, "none">, (r: number, lat: number, lon: number) => string> = {
  emergency_department: (r, lat, lon) =>
    `node["amenity"="hospital"](around:${r},${lat},${lon});way["amenity"="hospital"](around:${r},${lat},${lon});`,
  urgent_care: (r, lat, lon) =>
    `node["healthcare"~"^(centre|clinic|doctor)$"](around:${r},${lat},${lon});node["amenity"~"^(clinic|doctors)$"](around:${r},${lat},${lon});way["amenity"~"^(clinic|doctors)$"](around:${r},${lat},${lon});`,
  primary_care: (r, lat, lon) =>
    `node["amenity"~"^(doctors|clinic)$"](around:${r},${lat},${lon});way["amenity"~"^(doctors|clinic)$"](around:${r},${lat},${lon});`,
  pharmacy: (r, lat, lon) =>
    `node["amenity"="pharmacy"](around:${r},${lat},${lon});way["amenity"="pharmacy"](around:${r},${lat},${lon});`,
};

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function toPlace(el: Element, lat: number, lon: number): Place | null {
  const t = el.tags ?? {};
  const pLat = el.lat ?? el.center?.lat;
  const pLon = el.lon ?? el.center?.lon;
  if (pLat == null || pLon == null) return null;

  const street = [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" ");
  const address = [street, t["addr:city"]].filter(Boolean).join(", ") || null;

  return {
    name: t.name ?? t["operator"] ?? "Unnamed facility",
    kind: t.healthcare ?? t.amenity ?? "facility",
    lat: pLat,
    lon: pLon,
    distanceKm: haversineKm(lat, lon, pLat, pLon),
    hasEmergency: t.emergency === "yes",
    openingHours: t.opening_hours ?? null,
    phone: t.phone ?? t["contact:phone"] ?? null,
    address,
    // A map link rather than turn-by-turn — the user's own map app knows traffic.
    mapUrl: `https://www.openstreetmap.org/?mlat=${pLat}&mlon=${pLon}#map=17/${pLat}/${pLon}`,
  };
}

export async function findCare(
  type: CareType,
  lat: number,
  lon: number,
  limit = 4,
): Promise<Place[]> {
  if (type === "none") return [];

  // Widen the search rather than return nothing — rural users exist.
  for (const radius of [6000, 20000, 60000]) {
    const elements = await overpass(
      `[out:json][timeout:20];(${QUERIES[type](radius, lat, lon)});out center 60;`,
    );
    if (!elements) continue;

    let places = elements
      .map((el) => toPlace(el, lat, lon))
      .filter((p): p is Place => p !== null && p.name !== "Unnamed facility");

    // For an emergency, a confirmed ER outranks a closer facility without one.
    if (type === "emergency_department") {
      const withEr = places.filter((p) => p.hasEmergency);
      if (withEr.length > 0) places = withEr;
    }

    places.sort((a, b) => a.distanceKm - b.distanceKm);
    if (places.length > 0) return places.slice(0, limit);
  }
  return [];
}
