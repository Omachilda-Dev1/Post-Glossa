import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";
import BlogCard from "@/components/BlogCard";
import { locales } from "@/i18n";

interface Props {
  params: { locale: string; tag: string };
}

export async function generateStaticParams() {
  const result: { locale: string; tag: string }[] = [];
  for (const locale of locales) {
    for (const tag of getAllTags(locale)) {
      result.push({ locale, tag: encodeURIComponent(tag) });
    }
  }
  return result;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tag);
  const t = await getTranslations({ locale: params.locale, namespace: "blog" });
  return buildPageMetadata(`${t("posts_tagged")}: ${decodedTag}`, t("subtitle"), params.locale, `/blog/tags/${params.tag}`);
}

export default async function TagPage({ params }: Props) {
  const locale = params.locale;
  const decodedTag = decodeURIComponent(params.tag);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getPostsByTag(decodedTag, locale);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <header className="mb-10">
        <Link href={`/${locale}/blog/tags`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {t("all_tags")}
        </Link>
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">
          {t("posts_tagged")}: <span className="text-brand">{decodedTag}</span>
        </h1>
        <p className="mt-2 text-gray-500">{posts.length} {posts.length === 1 ? "article" : "articles"}</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 py-20 text-center">{t("no_posts")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} readingTimeLabel={post.readingTimeText} />
          ))}
        </div>
      )}
    </div>
  );
}
