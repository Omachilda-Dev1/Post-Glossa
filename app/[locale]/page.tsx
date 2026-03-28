import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/mdx";
import { websiteJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import BlogCard from "@/components/BlogCard";
import { locales } from "@/i18n";

interface HomePageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "home" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
  return {
    title: "Postglossa — Words without borders",
    description: t("hero_subtitle"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title: "Postglossa — Words without borders",
      description: t("hero_subtitle"),
      url: `${siteUrl}/${locale}`,
      siteName: "Postglossa",
      type: "website",
    },
  };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const posts = getAllPosts(locale);
  const featured = posts[0];
  const rest = posts.slice(1, 4);

  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      {/* Hero */}
      <section className="relative bg-white dark:bg-[#1a0a04] py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            {locales.length} languages · Words without borders
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            <span className="gradient-text">{t("hero_title")}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/blog`}
              className="px-8 py-4 bg-brand text-white font-semibold rounded-2xl shadow-lg shadow-brand/30 hover:bg-brand-700 transition-colors"
            >
              {t("hero_cta")}
            </Link>
            <Link
              href={`/${locale}/blog/tags`}
              className="px-8 py-4 bg-white dark:bg-[#2a0e05] text-gray-800 dark:text-gray-200 font-semibold rounded-2xl border border-gray-200 dark:border-[#501907] hover:border-brand/50 hover:text-brand transition-all"
            >
              {t("topics_title")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-y border-gray-100 dark:border-[#501907] bg-gray-50/50 dark:bg-[#501907]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-3 divide-x divide-gray-200 dark:divide-[#501907]">
          {[
            { value: `${posts.length * locales.length}+`, label: t("stats_posts") },
            { value: locales.length, label: t("stats_languages") },
            { value: `${getAllTags(locale).length}+`, label: t("stats_authors") },
          ].map((s) => (
            <div key={s.label} className="text-center px-4">
              <div className="font-serif text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
            {t("latest_posts")}
          </h2>
          <Link href={`/${locale}/blog`} className="text-sm font-medium text-brand hover:underline">
            {t("view_all")} →
          </Link>
        </div>

        {featured && (
          <div className="mb-8">
            <BlogCard
              post={featured}
              locale={locale}
              featured
              featuredLabel={t("featured")}
              readingTimeLabel={featured.readingTimeText}
            />
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} readingTimeLabel={post.readingTimeText} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-medium rounded-2xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand/25"
          >
            {t("view_all")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
