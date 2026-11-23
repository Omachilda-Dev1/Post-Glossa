import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";
import BlogCard from "@/components/BlogCard";
import { locales } from "@/i18n";

interface Props {
  params: { locale: string; tag: string };
}

export async function generateStaticParams() {
  return locales.flatMap((locale) => getAllTags(locale).map((tag) => ({ locale, tag: encodeURIComponent(tag) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tag);
  const t = await getTranslations({ locale: params.locale, namespace: "blog" });
  return buildPageMetadata(`${t("posts_tagged")}: ${decodedTag}`, t("subtitle"), params.locale, `/blog/tags/${params.tag}`);
}

export default async function TagPage({ params }: Props) {
  const locale = params.locale;
  setRequestLocale(locale);
  const decodedTag = decodeURIComponent(params.tag);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getPostsByTag(decodedTag, locale);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 pt-10">
      <header className="pb-8 border-b border-rule">
        <Link href={`/${locale}/blog/tags`} className="kicker hover:text-accent">← {t("all_tags")}</Link>
        <h1 className="mt-4 font-serif text-5xl sm:text-6xl tracking-[-0.03em] text-ink">
          <span className="text-accent">#</span>{decodedTag}
        </h1>
        <p className="mt-3 kicker">{t("post_count", { count: posts.length })}</p>
      </header>

      {posts.length === 0 ? (
        <p className="py-24 text-center font-serif text-xl italic text-muted">{t("no_posts")}</p>
      ) : (
        <div className="grid gap-x-10 gap-y-12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
