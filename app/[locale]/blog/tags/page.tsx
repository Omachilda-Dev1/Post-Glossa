import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/mdx";
import { buildPageMetadata } from "@/lib/seo";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildPageMetadata(t("all_tags"), t("subtitle"), locale, "/blog/tags");
}

export default async function TagsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const tags = getAllTags(locale)
    .map((tag) => ({ tag, posts: getPostsByTag(tag, locale) }))
    .sort((a, b) => b.posts.length - a.posts.length || a.tag.localeCompare(b.tag));

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 pt-10">
      <header className="pb-8 border-b border-rule">
        <p className="kicker-accent">{t("kicker")}</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl tracking-[-0.03em] text-ink">{t("all_tags")}</h1>
      </header>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
        {tags.map(({ tag, posts }) => (
          <li key={tag} className="border-b border-rule">
            <Link href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`} className="group flex items-baseline justify-between gap-4 py-5">
              <span>
                <span className="font-serif text-2xl text-ink group-hover:text-accent transition-colors">{tag}</span>
                <span className="mt-1 block text-sm text-muted line-clamp-1">{posts[0]?.title}</span>
              </span>
              <span className="font-mono text-sm text-muted tabular-nums">{String(posts.length).padStart(2, "0")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
