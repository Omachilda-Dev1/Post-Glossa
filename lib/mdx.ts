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

export function getPostBySlug(slug: string, locale: string): Post | null {
  const dir = path.join(contentDir, locale);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const file = files.find((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data } = matter(raw);
    return data.slug === slug;
  });
  if (!file) return null;
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return { ...(data as Post), content, readingTimeText: stats.text };
}

export function getAllPosts(locale: string): Post[] {
  const files = getPostSlugs(locale);
  const dir = path.join(contentDir, locale);
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);
      return { ...(data as Post), content, readingTimeText: stats.text };
    })
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
