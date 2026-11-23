import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { getNews, isDesk, FEEDS, type Desk } from "@/lib/news";
import NewsCard from "@/components/NewsCard";
import TimeAgo from "@/components/TimeAgo";

interface Props {
  params: { locale: string };
  searchParams: { desk?: string; source?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "wire" });
  return buildPageMetadata(t("title"), t("subtitle"), params.locale, "/news");
}

export default async function NewsPage({ params: { locale }, searchParams }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "wire" });

  const desk: Desk | undefined = isDesk(searchParams.desk) ? searchParams.desk : undefined;
  const source = FEEDS.some((f) => f.source === searchParams.source) ? searchParams.source : undefined;

  const items = await getNews({ desk, source, limit: 80 });
  const top = items.filter((i) => i.image).slice(0, 3);
  const rest = items.filter((i) => !top.includes(i));

  const qs = (d?: string, s?: string) => {
    const p = new URLSearchParams();
    if (d) p.set("desk", d);
    if (s) p.set("source", s);
    const str = p.toString();
    return `/${locale}/news${str ? `?${str}` : ""}`;
  };

  const desks: { key?: Desk; label: string }[] = [
    { key: undefined, label: t("all") },
    { key: "tech", label: t("tech") },
    { key: "world", label: t("world") },
  ];
  const visibleSources = FEEDS.filter((f) => !desk || f.desk === desk);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 pt-10">
      <header className="grid gap-6 lg:grid-cols-12 items-end pb-8 border-b border-rule">
        <div className="lg:col-span-8">
          <p className="kicker-accent flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" aria-hidden="true" />
            {t("live")}
          </p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl tracking-[-0.03em] text-ink">{t("title")}</h1>
          <p className="mt-4 max-w-2xl font-serif text-lg sm:text-xl leading-relaxed text-ink/75">{t("subtitle")}</p>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          {items[0] && (
            <p className="kicker">
              {t("latest")} <TimeAgo iso={items[0].published} locale={locale} className="text-ink" />
            </p>
          )}
          <p className="kicker mt-1">{t("english_note")}</p>
        </div>
      </header>

      {/* Filters */}
      <nav aria-label={t("filters")} className="py-4 border-b border-rule flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {desks.map((d) => {
            const active = desk === d.key && !source;
            return (
              <Link
                key={d.label}
                href={qs(d.key)}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                  active ? "bg-ink text-paper" : "text-muted hover:text-ink"
                }`}
              >
                {d.label}
              </Link>
            );
          })}
        </div>
        <div className="flex gap-x-4 gap-y-1 flex-wrap">
          {visibleSources.map((f) => {
            const active = source === f.source;
            return (
              <Link
                key={f.source}
                href={active ? qs(desk) : qs(desk, f.source)}
                aria-current={active ? "page" : undefined}
                className={`text-[13px] transition-colors ${active ? "text-accent underline underline-offset-4" : "text-muted hover:text-ink"}`}
              >
                {f.source}
              </Link>
            );
          })}
        </div>
      </nav>

      {items.length === 0 ? (
        <p className="py-24 text-center font-serif text-xl italic text-muted">{t("empty")}</p>
      ) : (
        <>
          {top.length > 0 && (
            <div className="grid gap-10 py-10 md:grid-cols-3 border-b border-rule">
              {top.map((item) => (
                <NewsCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          )}

          <div className="grid gap-x-12 lg:grid-cols-2">
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} locale={locale} variant="row" />
            ))}
          </div>
        </>
      )}

      <p className="mt-12 max-w-2xl text-sm text-muted leading-relaxed">
        {t("disclaimer")}{" "}
        <a href="/api/news" className="font-mono text-[12px] text-accent hover:underline underline-offset-4">/api/news</a>
      </p>
    </div>
  );
}
