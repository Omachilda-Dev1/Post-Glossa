"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Post } from "@/lib/mdx";
import BlogCard from "./BlogCard";

type SearchablePost = Omit<Post, "content"> & { content: string };

export default function SearchClient({ posts, locale }: { posts: SearchablePost[]; locale: string }) {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");

  // Support /search?q=... (also used by the WebSite JSON-LD search action).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query, posts]);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 pt-10">
      <header className="pb-6 border-b-2 border-ink">
        <h1 className="sr-only">{t("title")}</h1>
        <label htmlFor="q" className="kicker-accent">{t("title")}</label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          autoFocus
          className="mt-3 w-full bg-transparent font-serif text-4xl sm:text-5xl tracking-[-0.02em] text-ink placeholder:text-muted/50 focus:outline-none"
        />
      </header>

      {!query.trim() ? (
        <p className="py-16 font-serif text-xl italic text-muted">{t("hint")}</p>
      ) : results.length === 0 ? (
        <div className="py-16">
          <p className="font-serif text-2xl text-ink">{t("no_results")}</p>
          <p className="mt-2 text-muted">{t("try_again")}</p>
        </div>
      ) : (
        <>
          <p className="kicker py-4">{t("results", { count: results.length })}</p>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post) => (
              <BlogCard key={post.slug} post={post as Post} locale={locale} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
