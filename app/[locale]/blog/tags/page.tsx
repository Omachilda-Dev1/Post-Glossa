import { getTranslations } from "next-intl/server";
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

export default async function TagsPage({ params }: Props) {
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "blog" });
  const tags = getAllTags(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t("all_tags")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
      </header>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => {
          const count = getPostsByTag(tag, locale).length;
          return (
            <Link
              key={tag}
              href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-brand hover:text-white transition-colors"
            >
              <span>{tag}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-semibold">
                {count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
