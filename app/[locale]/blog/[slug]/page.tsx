import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations } from "next-intl/server";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { buildPostMetadata, articleJsonLd } from "@/lib/seo";
import { locales } from "@/i18n";
import JsonLd from "@/components/JsonLd";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import BlogCard from "@/components/BlogCard";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

interface PostPageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const posts = getAllPosts(locale);
    posts.forEach((p) => params.push({ locale, slug: p.slug }));
  }
  return params;
}

export async function generateMetadata({ params: { locale, slug } }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(slug, locale);
  if (!post) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
  return {
    ...buildPostMetadata(post, locale),
    alternates: { canonical: `${siteUrl}/${locale}/blog/${slug}` },
  };
}

export default async function PostPage({ params: { locale, slug } }: PostPageProps) {
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const allPosts = getAllPosts(locale);
  const related = allPosts
    .filter((p) => p.slug !== slug && p.tags?.some((tag) => post.tags?.includes(tag)))
    .slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === "fr" ? "fr-FR"
    : locale === "de" ? "de-DE"
    : locale === "es" ? "es-ES"
    : locale === "pt" ? "pt-BR"
    : locale === "ja" ? "ja-JP"
    : locale === "zh" ? "zh-CN"
    : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleJsonLd(post, locale)} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        {/* Back */}
        <div className="mb-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t("back_to_blog")}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-brand/10 text-brand hover:bg-brand hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-5 border-b border-gray-100 dark:border-[#501907]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center text-brand text-xs font-bold">
                {post.author.charAt(0)}
              </div>
              <span>{t("by")} <span className="font-semibold text-gray-800 dark:text-gray-200">{post.author}</span></span>
            </div>
            <time dateTime={post.date}>{formattedDate}</time>
            <span className="text-brand">{post.readingTimeText}</span>
          </div>
        </header>

        {/* Cover */}
        {post.coverImage && (
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-10 shadow-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert prose-headings:font-serif prose-a:text-brand max-w-none">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeHighlight],
              },
            }}
          />
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-[#501907]">
          <ShareButtons url={postUrl} title={post.title} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-100 dark:border-[#501907]">
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {t("related")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} locale={locale} readingTimeLabel={p.readingTimeText} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
