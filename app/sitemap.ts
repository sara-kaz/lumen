import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/journal";
import { CASES } from "@/lib/cases";

const BASE = "https://lumen-virid-sigma.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    { url: "", priority: 1 },
    { url: "/meds", priority: 0.9 },
    { url: "/labs", priority: 0.9 },
    { url: "/care", priority: 0.9 },
    { url: "/journal", priority: 0.7 },
    { url: "/cases", priority: 0.5 },
  ];

  return [
    ...pages.map((p) => ({
      url: `${BASE}${p.url}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.priority,
    })),
    ...getPosts().map((p) => ({
      url: `${BASE}/journal/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...CASES.map((c) => ({
      url: `${BASE}/case/${c.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
