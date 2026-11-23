import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Post } from "@/lib/mdx";
import { formatDate } from "@/lib/format";

interface BlogCardProps {
  post: Post;
  locale: string;
  variant?: "lead" | "standard" | "list";
  priority?: boolean;
}

/** An essay from the journal. `lead` is the front-page story, `list` a compact text row. */
export default function BlogCard({ post, locale, variant = "standard", priority = false }: BlogCardProps) {
  const t = useTranslations("blog");
  const href = `/${locale}/blog/${post.slug}`;
  const minutes = post.readingTime || Math.max(1, Math.round(post.content.split(/\s+/).length / 230));
  const tag = post.tags?.[0];

  const meta = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 kicker">
      <span className="text-ink/80">{post.author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.date}>{formatDate(post.date, locale, "short")}</time>
      <span aria-hidden="true">·</span>
      <span>{t("reading_time", { minutes })}</span>
    </div>
  );

  if (variant === "lead") {
    return (
      <article className="group">
        {post.coverImage && (
          <Link href={href} tabIndex={-1} aria-hidden="true" className="block relative aspect-[16/9] overflow-hidden bg-rule/50 mb-5">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </Link>
        )}
        {tag && (
          <Link href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`} className="kicker-accent hover:underline underline-offset-4">
            {tag}
          </Link>
        )}
        <h2 className="mt-2 font-serif text-[2rem] sm:text-[2.6rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink text-balance">
          <Link href={href} className="headline-link">{post.title}</Link>
        </h2>
        <p className="mt-4 font-serif text-lg sm:text-xl leading-relaxed text-ink/75 text-pretty max-w-2xl">{post.description}</p>
        <div className="mt-4">{meta}</div>
      </article>
    );
  }

  if (variant === "list") {
    return (
      <article className="group py-5 border-b border-rule">
        {tag && <span className="kicker-accent">{tag}</span>}
        <h3 className="mt-1.5 font-serif text-xl leading-snug text-ink text-pretty">
          <Link href={href} className="headline-link">{post.title}</Link>
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted line-clamp-2">{post.description}</p>
        <div className="mt-3">{meta}</div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col">
      {post.coverImage && (
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block relative aspect-[3/2] overflow-hidden bg-rule/50 mb-4">
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </Link>
      )}
      {tag && <span className="kicker-accent">{tag}</span>}
      <h3 className="mt-1.5 font-serif text-[1.35rem] leading-snug text-ink text-pretty">
        <Link href={href} className="headline-link">{post.title}</Link>
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted line-clamp-3">{post.description}</p>
      <div className="mt-3">{meta}</div>
    </article>
  );
}
