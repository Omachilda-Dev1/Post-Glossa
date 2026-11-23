"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NewsItem, Desk } from "@/lib/news";
import NewsCard from "./NewsCard";

interface Labels {
  title: string;
  live: string;
  all: string;
  tech: string;
  world: string;
  more: string;
  empty: string;
}

interface Props {
  initial: NewsItem[];
  locale: string;
  labels: Labels;
  limit?: number;
}

const REFRESH_MS = 5 * 60 * 1000;

/**
 * Homepage sidebar. Server-rendered with the current wire, then polls
 * /api/news so a reader who leaves the tab open sees new headlines arrive.
 */
export default function LiveWire({ initial, locale, labels, limit = 9 }: Props) {
  const [items, setItems] = useState(initial);
  const [desk, setDesk] = useState<Desk | "all">("all");

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/news?limit=40");
        if (!res.ok) return;
        const data = (await res.json()) as { items: NewsItem[] };
        if (!cancelled && data.items?.length) setItems(data.items);
      } catch {
        /* keep what we have */
      }
    }
    const id = setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const shown = items.filter((i) => desk === "all" || i.desk === desk).slice(0, limit);
  const tabs: { key: Desk | "all"; label: string }[] = [
    { key: "all", label: labels.all },
    { key: "tech", label: labels.tech },
    { key: "world", label: labels.world },
  ];

  return (
    <section aria-labelledby="wire-heading">
      <div className="section-head justify-between">
        <h2 id="wire-heading" className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
          </span>
          {labels.title}
        </h2>
        <span className="kicker-accent">{labels.live}</span>
      </div>

      <div role="tablist" aria-label={labels.title} className="flex gap-1 mb-2 -mt-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={desk === tab.key}
            onClick={() => setDesk(tab.key)}
            className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
              desk === tab.key ? "bg-ink text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-6 text-sm text-muted">{labels.empty}</p>
      ) : (
        <div>
          {shown.map((item) => (
            <NewsCard key={item.id} item={item} locale={locale} variant="compact" />
          ))}
        </div>
      )}

      <Link
        href={`/${locale}/news${desk === "all" ? "" : `?desk=${desk}`}`}
        className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-accent hover:underline underline-offset-4"
      >
        {labels.more} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
