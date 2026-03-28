import type { Metadata } from "next";
import { Post } from "./mdx";
import { locales } from "@/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
const siteName = "Postglossa";

export function buildPostMetadata(post: Post, locale: string): Metadata {
  const url = `${siteUrl}/${locale}/blog/${post.slug}`;
  const hreflang = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/blog/${post.slug}`]));
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url, languages: hreflang },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export function buildPageMetadata(
  title: string,
  description: string,
  locale: string,
  pagePath = ""
): Metadata {
  const url = `${siteUrl}/${locale}${pagePath}`;
  const hreflang = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${pagePath}`]));
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflang },
    openGraph: { title, description, url, siteName, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function articleJsonLd(post: Post, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    url: `${siteUrl}/${locale}/blog/${post.slug}`,
    inLanguage: locale,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: "Words without borders — a multilingual blog platform",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
