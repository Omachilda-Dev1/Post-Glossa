import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import SearchClient from "@/components/SearchClient";
import { getAllPosts } from "@/lib/mdx";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "search" });
  return buildPageMetadata(t("title"), t("placeholder"), params.locale, "/search");
}

export default async function SearchPage({ params }: Props) {
  const posts = getAllPosts(params.locale);
  return <SearchClient posts={posts} locale={params.locale} />;
}
