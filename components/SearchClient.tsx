"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Post } from "@/lib/mdx";
import BlogCard from "./BlogCard";

export default function SearchClient({ posts, locale }: { posts: Post[]; locale: string }) {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query, posts]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-6">{t("title")}</h1>

      <div className="relative mb-10">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          autoFocus
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-[#501907] bg-white dark:bg-[#2a0e05] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand text-lg transition-all"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Clear">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {!query.trim() ? (
        <div className="text-center py-20 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg">{t("placeholder")}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">{t("no_results")}</p>
          <p className="text-gray-400">{t("try_again")}</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-6">{t("results", { count: results.length })}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {results.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} readingTimeLabel={post.readingTimeText} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
