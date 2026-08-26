import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * The build journal. Posts are the same markdown files written for the hackathon's
 * content requirement — kept as plain .md so they can be published off-site
 * unchanged, and read at build time so there is no runtime file access.
 */
const DIR = path.join(process.cwd(), "content");

/** Only numbered pieces are posts; README and the launch package are working files. */
const POST_PATTERN = /^\d{2}-.+\.md$/;

export type Post = {
  slug: string;
  title: string;
  subtitle: string;
  order: number;
  html: string;
  readingMinutes: number;
};

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const lines = raw.split("\n");

  // First H1 is the title; the italic line under it is the series subtitle.
  const titleLine = lines.find((l) => l.startsWith("# ")) ?? "# Untitled";
  const title = titleLine.replace(/^#\s+/, "").trim();
  const subtitle =
    lines.find((l) => /^\*.+\*$/.test(l.trim()))?.replace(/\*/g, "").trim() ?? "";

  // Strip the title and subtitle from the body — the page renders them itself.
  const body = raw
    .replace(titleLine, "")
    .replace(/^\*.+\*$/m, "")
    .trim();

  const words = body.split(/\s+/).length;

  return {
    slug: file.replace(/^\d{2}-/, "").replace(/\.md$/, ""),
    title,
    subtitle,
    order: Number(file.slice(0, 2)),
    html: marked.parse(body, { async: false }) as string,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export function getPosts(): Post[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => POST_PATTERN.test(f))
    .map(parse)
    .sort((a, b) => a.order - b.order);
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
