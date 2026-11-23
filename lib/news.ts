import { XMLParser } from "fast-xml-parser";

/**
 * The Wire — a key-free news aggregator.
 *
 * Pulls public RSS/Atom feeds from established newsrooms, normalises them into
 * one shape, de-duplicates, and sorts newest first. Every fetch goes through
 * Next's data cache with a revalidate window, so pages that use it are
 * regenerated in the background (ISR) and the wire stays fresh without a
 * database, cron job, or paid API.
 *
 * To add a source, append to FEEDS. A failing feed is skipped, never fatal.
 */

export type Desk = "tech" | "world";

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  image: string | null;
  source: string;
  desk: Desk;
  published: string; // ISO 8601
}

export interface Feed {
  source: string;
  url: string;
  desk: Desk;
  home: string;
}

/** Seconds between background refreshes of every feed. */
export const NEWS_REVALIDATE = 600;

export const FEEDS: Feed[] = [
  // Tech desk
  { source: "Ars Technica", desk: "tech", url: "https://feeds.arstechnica.com/arstechnica/index", home: "https://arstechnica.com" },
  { source: "TechCrunch", desk: "tech", url: "https://techcrunch.com/feed/", home: "https://techcrunch.com" },
  { source: "Wired", desk: "tech", url: "https://www.wired.com/feed/rss", home: "https://www.wired.com" },
  { source: "BBC Technology", desk: "tech", url: "https://feeds.bbci.co.uk/news/technology/rss.xml", home: "https://www.bbc.com/news/technology" },
  { source: "The Guardian Tech", desk: "tech", url: "https://www.theguardian.com/uk/technology/rss", home: "https://www.theguardian.com/technology" },
  { source: "Hacker News", desk: "tech", url: "https://hnrss.org/frontpage", home: "https://news.ycombinator.com" },
  // World desk
  { source: "BBC World", desk: "world", url: "https://feeds.bbci.co.uk/news/world/rss.xml", home: "https://www.bbc.com/news/world" },
  { source: "The Guardian World", desk: "world", url: "https://www.theguardian.com/world/rss", home: "https://www.theguardian.com/world" },
  { source: "Al Jazeera", desk: "world", url: "https://www.aljazeera.com/xml/rss/all.xml", home: "https://www.aljazeera.com" },
  { source: "NPR World", desk: "world", url: "https://feeds.npr.org/1004/rss.xml", home: "https://www.npr.org/sections/world" },
];

const PER_FEED_LIMIT = 15;
const FETCH_TIMEOUT_MS = 8000;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  parseAttributeValue: false,
  htmlEntities: true,
  trimValues: true,
});

// ---------- helpers ----------

type Node = unknown;

function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function text(v: Node): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return text(v[0]);
  if (typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return text((v as Record<string, unknown>)["#text"]);
  }
  return "";
}

function attr(v: Node, name: string): string {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const a = (v as Record<string, unknown>)[`@_${name}`];
    return typeof a === "string" ? a : "";
  }
  return "";
}

const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'", "&nbsp;": " ",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&[a-z]+;|&#39;/gi, (m) => ENTITY_MAP[m.toLowerCase()] ?? m);
}

function stripHtml(s: string): string {
  return decodeEntities(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "") + "…";
}

function upgradeImage(url: string): string {
  // BBC serves 240px thumbnails in RSS; the same path works at 976px.
  return url.replace(/(ichef\.bbci\.co\.uk\/(?:ace\/standard|news))\/\d+\//, "$1/976/");
}

function pickImage(item: Record<string, unknown>, html: string): string | null {
  const candidates: { url: string; width: number }[] = [];

  for (const m of asArray(item["media:content"] as Node[])) {
    const url = attr(m, "url");
    const medium = attr(m, "medium");
    const type = attr(m, "type");
    if (url && (medium === "image" || type.startsWith("image") || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url) || (!medium && !type))) {
      candidates.push({ url, width: Number(attr(m, "width")) || 0 });
    }
  }
  for (const group of asArray(item["media:group"] as Node[])) {
    for (const m of asArray((group as Record<string, unknown>)?.["media:content"] as Node[])) {
      const url = attr(m, "url");
      if (url) candidates.push({ url, width: Number(attr(m, "width")) || 0 });
    }
  }
  for (const t of asArray(item["media:thumbnail"] as Node[])) {
    const url = attr(t, "url");
    if (url) candidates.push({ url, width: Number(attr(t, "width")) || 1 });
  }
  for (const e of asArray(item.enclosure as Node[])) {
    const url = attr(e, "url");
    if (url && attr(e, "type").startsWith("image")) candidates.push({ url, width: 0 });
  }

  if (candidates.length) {
    candidates.sort((a, b) => b.width - a.width);
    return upgradeImage(decodeEntities(candidates[0].url));
  }

  // Fall back to the first real inline image (skip tracking pixels and broken srcs).
  for (const m of Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi))) {
    const src = decodeEntities(m[1]);
    if (/^https?:\/\//.test(src) && !/pixel|tracking|feeds\.feedburner|\.gif(\?|$)/i.test(src)) return src;
  }
  return null;
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

// ---------- parsing ----------

function normalise(raw: Record<string, unknown>, feed: Feed): NewsItem | null {
  const title = stripHtml(text(raw.title));

  // RSS <link>text</link> or Atom <link href="" rel="alternate"/>
  let link = text(raw.link);
  if (!link) {
    const links = asArray(raw.link as Node[]);
    const alt = links.find((l) => !attr(l, "rel") || attr(l, "rel") === "alternate") ?? links[0];
    link = attr(alt, "href");
  }
  if (!title || !link) return null;

  const html = text(raw["content:encoded"]) || text(raw.content) || text(raw.description) || text(raw.summary);
  const desc = text(raw.description) || text(raw.summary) || html;

  const dateStr = text(raw.pubDate) || text(raw.published) || text(raw.updated) || text(raw["dc:date"]);
  const date = dateStr ? new Date(dateStr) : null;
  if (!date || Number.isNaN(date.getTime())) return null;

  // Hacker News descriptions are just "Article URL / Comments URL" boilerplate.
  const summary = feed.source === "Hacker News" ? "" : truncate(stripHtml(desc), 240);

  return {
    id: hash(link),
    title,
    link: link.trim(),
    summary,
    image: pickImage(raw, html),
    source: feed.source,
    desk: feed.desk,
    published: date.toISOString(),
  };
}

async function fetchFeed(feed: Feed): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PostglossaWire/1.0; +https://github.com/)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
      next: { revalidate: NEWS_REVALIDATE, tags: ["news"] },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const doc = parser.parse(xml) as Record<string, any>;

    const rawItems: Record<string, unknown>[] =
      asArray(doc?.rss?.channel?.item).length ? asArray(doc.rss.channel.item)
      : asArray(doc?.feed?.entry).length ? asArray(doc.feed.entry)
      : asArray(doc?.["rdf:RDF"]?.item);

    return rawItems
      .slice(0, PER_FEED_LIMIT)
      .map((r) => normalise(r, feed))
      .filter((x): x is NewsItem => x !== null);
  } catch (err) {
    console.warn(`[wire] ${feed.source} failed:`, (err as Error).message);
    return [];
  }
}

// ---------- public API ----------

export interface GetNewsOptions {
  desk?: Desk;
  source?: string;
  limit?: number;
  /** Only items that carry an image (for visual layouts). */
  withImage?: boolean;
}

export async function getNews({ desk, source, limit = 60, withImage = false }: GetNewsOptions = {}): Promise<NewsItem[]> {
  const feeds = FEEDS.filter((f) => (!desk || f.desk === desk) && (!source || f.source === source));
  const results = await Promise.all(feeds.map(fetchFeed));

  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();
  const items: NewsItem[] = [];

  for (const item of results.flat()) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const linkKey = item.link.split("?")[0];
    if (seenLinks.has(linkKey) || seenTitles.has(key)) continue;
    seenLinks.add(linkKey);
    seenTitles.add(key);
    if (withImage && !item.image) continue;
    items.push(item);
  }

  // Ignore items dated in the future (bad feed clocks) relative to now.
  const now = Date.now() + 5 * 60 * 1000;
  const sorted = items
    .filter((i) => new Date(i.published).getTime() <= now)
    .sort((a, b) => b.published.localeCompare(a.published));

  // In mixed lists, cap each source so a high-volume feed can't drown out the rest.
  if (!source && feeds.length > 1) {
    const cap = Math.max(4, Math.ceil(limit / feeds.length) + 2);
    const counts = new Map<string, number>();
    return sorted
      .filter((i) => {
        const n = (counts.get(i.source) ?? 0) + 1;
        counts.set(i.source, n);
        return n <= cap;
      })
      .slice(0, limit);
  }
  return sorted.slice(0, limit);
}

/** Up to `perSource` items per source, interleaved — keeps one loud feed from taking over a section. */
export function diversify(items: NewsItem[], perSource = 2, limit = 6): NewsItem[] {
  const counts = new Map<string, number>();
  const out: NewsItem[] = [];
  for (const item of items) {
    const n = counts.get(item.source) ?? 0;
    if (n >= perSource) continue;
    counts.set(item.source, n + 1);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export function isDesk(v: unknown): v is Desk {
  return v === "tech" || v === "world";
}
