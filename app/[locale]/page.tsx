import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getNews, diversify, type NewsItem } from "@/lib/news";
import { websiteJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import BlogCard from "@/components/BlogCard";
import NewsCard from "@/components/NewsCard";
import LiveWire from "@/components/LiveWire";
import { locales } from "@/i18n";

export const revalidate = 600; // keep in step with NEWS_REVALIDATE

interface HomePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "home" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
  const title = `Postglossa: ${t("hero_title")}`;
  return {
    title: { absolute: title },
    description: t("hero_subtitle"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title,
      description: t("hero_subtitle"),
      url: `${siteUrl}/${locale}`,
      siteName: "Postglossa",
      type: "website",
    },
  };
}

function DeskSection({
  id, title, moreLabel, moreHref, items, locale, flip = false,
}: {
  id: string; title: string; moreLabel: string; moreHref: string; items: NewsItem[]; locale: string; flip?: boolean;
}) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  return (
    <section aria-labelledby={id} className="mt-20">
      <div className="section-head justify-between">
        <h2 id={id} className="font-serif text-2xl sm:text-[1.75rem] tracking-[-0.01em] text-ink">{title}</h2>
        <Link href={moreHref} className="kicker hover:text-accent transition-colors">
          {moreLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className={`lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
          <NewsCard item={lead} locale={locale} />
        </div>
        <div className="lg:col-span-6 -mt-5">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} locale={locale} variant="row" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const tw = await getTranslations({ locale, namespace: "wire" });

  const posts = getAllPosts(locale);
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const others = posts.filter((p) => p !== lead);
  const secondary = others.slice(0, 2);
  const notebook = others.slice(2, 8);

  const [wire, tech, world] = await Promise.all([
    getNews({ limit: 40 }),
    getNews({ desk: "tech", limit: 40 }),
    getNews({ desk: "world", limit: 40 }),
  ]);

  // Desk sections: a lead with a photo, then a spread of sources.
  const pickDesk = (items: NewsItem[]) => {
    const withImage = items.find((i) => i.image);
    const rest = diversify(items.filter((i) => i !== withImage), 1, 4);
    return withImage ? [withImage, ...rest] : rest;
  };

  return (
    <>
      <JsonLd data={websiteJsonLd(locale)} />

      <div className="mx-auto max-w-page px-4 sm:px-6">
        {/* Front page */}
        <div className="grid gap-x-10 gap-y-12 pt-8 sm:pt-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {lead && <BlogCard post={lead} locale={locale} variant="lead" priority />}

            {secondary.length > 0 && (
              <div className="mt-12 grid gap-10 border-t border-rule pt-8 sm:grid-cols-2">
                {secondary.map((p) => (
                  <BlogCard key={p.slug} post={p} locale={locale} />
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
            <div className="mb-10 bg-card border border-rule p-5">
              <p className="kicker-accent mb-2">{t("editor_note_title")}</p>
              <p className="font-serif text-[1.05rem] leading-relaxed text-ink/85 italic">{t("editor_note")}</p>
              <Link href={`/${locale}/about`} className="mt-3 inline-block kicker hover:text-accent transition-colors">
                {t("about_link")} <span aria-hidden="true">→</span>
              </Link>
            </div>

            <LiveWire
              initial={wire}
              locale={locale}
              labels={{
                title: tw("title"),
                live: tw("live"),
                all: tw("all"),
                tech: tw("tech"),
                world: tw("world"),
                more: t("more_wire"),
                empty: tw("empty"),
              }}
            />
          </aside>
        </div>

        <DeskSection
          id="tech-desk"
          title={t("tech_desk")}
          moreLabel={t("more_wire")}
          moreHref={`/${locale}/news?desk=tech`}
          items={pickDesk(tech)}
          locale={locale}
        />

        <DeskSection
          id="world-desk"
          title={t("world_desk")}
          moreLabel={t("more_wire")}
          moreHref={`/${locale}/news?desk=world`}
          items={pickDesk(world)}
          locale={locale}
          flip
        />

        {/* More essays */}
        {notebook.length > 0 && (
          <section aria-labelledby="notebook" className="mt-20">
            <div className="section-head justify-between">
              <h2 id="notebook" className="font-serif text-2xl sm:text-[1.75rem] tracking-[-0.01em] text-ink">{t("notebook")}</h2>
              <Link href={`/${locale}/blog`} className="kicker hover:text-accent transition-colors">
                {t("view_all")} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3 -mt-5">
              {notebook.map((p) => (
                <BlogCard key={p.slug} post={p} locale={locale} variant="list" />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
