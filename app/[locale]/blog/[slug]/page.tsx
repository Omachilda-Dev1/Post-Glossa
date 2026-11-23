import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { buildPostMetadata, articleJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { getNews } from "@/lib/news";
import { locales } from "@/i18n";
import JsonLd from "@/components/JsonLd";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButtons from "@/components/ShareButtons";
import BlogCard from "@/components/BlogCard";
import NewsCard from "@/components/NewsCard";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

export const revalidate = 600;

interface PostPageProps {
  params: { locale: string; slug: string };
}

export async function generateStaticParams() {
  return locales.flatMap((locale) => getAllPosts(locale).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params: { locale, slug } }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(slug, locale);
  if (!post) return {};
  return buildPostMetadata(post, locale);
}

export default async function PostPage({ params: { locale, slug } }: PostPageProps) {
  setRequestLocale(locale);
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const tw = await getTranslations({ locale, namespace: "wire" });
  const allPosts = getAllPosts(locale);
  const related = allPosts
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: p.tags?.filter((tag) => post.tags?.includes(tag)).length ?? 0 }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);

  const wire = await getNews({ desk: "tech", limit: 5 });
  const minutes = post.readingTime || Math.max(1, Math.round(post.content.split(/\s+/).length / 230));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
  const postUrl = `${siteUrl}/${locale}/blog/${slug}`;

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleJsonLd(post, locale)} />

      <article className="mx-auto max-w-page px-4 sm:px-6 pt-10">
        <header className="mx-auto max-w-3xl text-center">
          <nav aria-label="Breadcrumb" className="kicker flex justify-center gap-2">
            <Link href={`/${locale}/blog`} className="hover:text-accent">{t("title")}</Link>
            {post.tags?.[0] && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/${locale}/blog/tags/${encodeURIComponent(post.tags[0])}`} className="text-accent hover:underline underline-offset-4">
                  {post.tags[0]}
                </Link>
              </>
            )}
          </nav>

          <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-[3.6rem] font-medium leading-[1.05] tracking-[-0.025em] text-ink text-balance">
            {post.title}
          </h1>
          <p className="mt-5 font-serif text-xl sm:text-[1.4rem] leading-relaxed text-ink/70 italic text-pretty">
            {post.description}
          </p>

          <div className="mt-7 flex flex-wrap justify-center items-center gap-x-3 gap-y-1 kicker">
            <span>{t("by")} <span className="text-ink">{post.author}</span></span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span aria-hidden="true">·</span>
            <span>{t("reading_time", { minutes })}</span>
          </div>
        </header>

        {post.coverImage && (
          <figure className="mt-10 mx-auto max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden bg-rule/50">
              <Image src={post.coverImage} alt="" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" />
            </div>
          </figure>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {/* Left rail: share */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-8">
              <ShareButtons url={postUrl} title={post.title} vertical />
            </div>
          </aside>

          <div className="lg:col-span-7 min-w-0">
            <div className="prose max-w-none prose-headings:font-medium">
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

            {post.tags?.length > 0 && (
              <div className="mt-12 pt-6 border-t border-rule flex flex-wrap gap-x-4 gap-y-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`} className="text-sm text-muted hover:text-accent transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 lg:hidden">
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            <div className="mt-10 border-t-2 border-ink pt-5 flex gap-4 items-start">
              <div className="h-12 w-12 shrink-0 bg-ink text-paper flex items-center justify-center font-serif text-xl" aria-hidden="true">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="kicker">{t("written_by")}</p>
                <p className="font-serif text-xl text-ink">{post.author}</p>
                {post.authorBio && <p className="mt-1 text-sm text-muted">{post.authorBio}</p>}
              </div>
            </div>
          </div>

          {/* Right rail: what's happening while you read */}
          {wire.length > 0 && (
            <aside className="lg:col-span-3 lg:border-l lg:border-rule lg:pl-8">
              <div className="lg:sticky lg:top-8">
                <div className="section-head">
                  <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink">{tw("meanwhile")}</h2>
                </div>
                <div className="-mt-3">
                  {wire.map((item) => (
                    <NewsCard key={item.id} item={item} locale={locale} variant="compact" />
                  ))}
                </div>
                <Link href={`/${locale}/news`} className="mt-3 inline-block kicker-accent hover:underline underline-offset-4">
                  {tw("title")} →
                </Link>
              </div>
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-labelledby="related">
            <div className="section-head">
              <h2 id="related" className="font-serif text-2xl sm:text-[1.75rem] tracking-[-0.01em] text-ink">{t("related")}</h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
