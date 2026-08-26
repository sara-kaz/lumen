import type { MetadataRoute } from "next";

const BASE = "https://lumen-virid-sigma.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing here is private, but crawling the model routes would burn credit
      // for no benefit — they are POST-only and return nothing useful to a crawler.
      disallow: ["/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
