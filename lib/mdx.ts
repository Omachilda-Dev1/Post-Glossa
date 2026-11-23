import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface Post {
  title: string;
  description: string;
  date: string;
  author: string;
  authorBio?: string;
  authorAvatar?: string;
  tags: string[];
  slug: string;
  locale: string;
  coverImage: string;
  readingTime: number;
  content: string;
  readingTimeText: string;
  featured?: boolean;
}

const contentDir = path.join(process.cwd(), "content");

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(contentDir, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

const AUTHOR_BIOS: Record<string, string> = {
  "Elena Marchetti": "Editor. Writes about language, localisation, and why the web still reads like it was built in one country.",
  "Soren Lindqvist": "Engineer. Ships the TypeScript, Docker, and database pieces, usually after breaking them in production first.",
  "Amara Osei": "Writes on search, distribution, and how good work actually gets found.",
  "Yuki Tanaka": "Former translator. Covers content strategy across Japanese, Chinese, and English.",
};

function toPost(raw: string): Post {
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  const post = { ...(data as Post), content, readingTimeText: stats.text };
  post.tags = Array.isArray(post.tags) ? post.tags : [];
  post.readingTime = post.readingTime || Math.max(1, Math.round(stats.minutes));
  post.authorBio = post.authorBio || AUTHOR_BIOS[post.author];
  return post;
}

export function getPostBySlug(slug: string, locale: string): Post | null {
  return getAllPosts(locale).find((p) => p.slug === slug) ?? null;
}

export function getAllPosts(locale: string): Post[] {
  const files = getPostSlugs(locale);
  const dir = path.join(contentDir, locale);
  return files
    .map((file) => toPost(fs.readFileSync(path.join(dir, file), "utf8")))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedPost(locale: string): Post | null {
  const posts = getAllPosts(locale);
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export function getAllTags(locale: string): string[] {
  const posts = getAllPosts(locale);
  const map = new Map<string, number>();
  posts.forEach((p) => p.tags?.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)));
  return Array.from(map.keys()).sort();
}

export function getTagCount(tag: string, locale: string): number {
  return getPostsByTag(tag, locale).length;
}

export function getPostsByTag(tag: string, locale: string): Post[] {
  return getAllPosts(locale).filter((p) => p.tags?.includes(tag));
}

export function getPaginatedPosts(locale: string, page: number, perPage = 9) {
  const all = getAllPosts(locale);
  const total = Math.ceil(all.length / perPage);
  const posts = all.slice((page - 1) * perPage, page * perPage);
  return { posts, total, page };
}

export function searchPosts(locale: string, query: string): Post[] {
  const q = query.toLowerCase();
  return getAllPosts(locale).filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q)) ||
      p.author.toLowerCase().includes(q)
  );
}
