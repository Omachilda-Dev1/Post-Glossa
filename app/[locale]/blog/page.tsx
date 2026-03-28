import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getPaginatedPosts, getAllTags } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";
import BlogCard from "@/components/BlogCard";
import { locales } from "@/i18n";

interface Props {
  params: { locale: string };
  searchParams: { page?: string };
}

export const revalidate = 3600;

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
  return {
    ...buildPageMetadata(t("title"), t("subtitle"), locale, "/blog"),
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/blog`])),
    },
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "blog" });
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const { posts, total } = getPaginatedPosts(locale, page, 9);
  const tags = getAllTags(locale);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t("title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{t("subtitle")}</p>
      </header>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand hover:text-white transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500 py-20 text-center">{t("no_posts")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              locale={locale}
              readingTimeLabel={post.readingTimeText}
            />
          ))}
        </div>
      )}

      {total > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-3" aria-label="Pagination">
          {page > 1 && (
            <Link href={`/${locale}/blog?page=${page - 1}`} className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand transition-colors">
              ← {t("prev")}
            </Link>
          )}
          <span className="text-sm text-gray-500">{t("page", { current: page, total })}</span>
          {page < total && (
            <Link href={`/${locale}/blog?page=${page + 1}`} className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand transition-colors">
              {t("next")} →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
