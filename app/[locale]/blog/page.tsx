import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getPaginatedPosts, getAllTags } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";
import BlogCard from "@/components/BlogCard";

interface Props {
  params: { locale: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildPageMetadata(t("title"), t("subtitle"), locale, "/blog");
}

export default async function BlogPage({ params, searchParams }: Props) {
  const locale = params.locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const { posts, total } = getPaginatedPosts(locale, page, 12);
  const tags = getAllTags(locale);
  const [first, ...rest] = posts;

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 pt-10">
      <header className="pb-8 border-b border-rule">
        <p className="kicker-accent">{t("kicker")}</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl tracking-[-0.03em] text-ink">{t("title")}</h1>
        <p className="mt-4 max-w-2xl font-serif text-lg sm:text-xl leading-relaxed text-ink/75">{t("subtitle")}</p>
      </header>

      {tags.length > 0 && (
        <nav aria-label={t("tags")} className="py-4 border-b border-rule flex flex-wrap gap-x-5 gap-y-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
              className="text-[13px] text-muted hover:text-accent transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </nav>
      )}

      {posts.length === 0 ? (
        <p className="py-24 text-center font-serif text-xl italic text-muted">{t("no_posts")}</p>
      ) : (
        <>
          {page === 1 && first ? (
            <div className="py-10 border-b border-rule grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <BlogCard post={first} locale={locale} variant="lead" priority />
              </div>
              <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10 -mt-5">
                {rest.slice(0, 3).map((p) => (
                  <BlogCard key={p.slug} post={p} locale={locale} variant="list" />
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-x-10 gap-y-12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {(page === 1 ? rest.slice(3) : posts).map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </>
      )}

      {total > 1 && (
        <nav className="mt-16 pt-6 border-t border-rule flex items-center justify-between" aria-label="Pagination">
          {page > 1 ? (
            <Link href={`/${locale}/blog?page=${page - 1}`} className="kicker hover:text-accent">← {t("prev")}</Link>
          ) : <span />}
          <span className="kicker">{t("page", { current: page, total })}</span>
          {page < total ? (
            <Link href={`/${locale}/blog?page=${page + 1}`} className="kicker hover:text-accent">{t("next")} →</Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}
