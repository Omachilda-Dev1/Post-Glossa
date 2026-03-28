import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/mdx";

interface BlogCardProps {
  post: Post;
  locale: string;
  featured?: boolean;
  featuredLabel?: string;
  readingTimeLabel?: string;
}

export default function BlogCard({ post, locale, featured = false, featuredLabel = "Featured", readingTimeLabel }: BlogCardProps) {
  const timeLabel = readingTimeLabel ?? `${post.readingTime} min`;

  if (featured) {
    return (
      <article className="bg-white dark:bg-[#1a0a04] rounded-3xl overflow-hidden border border-gray-100 dark:border-[#501907] shadow-sm hover:shadow-md transition-shadow">
        {post.coverImage && (
          <div className="relative h-56 w-full overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand text-white">{featuredLabel}</span>
            </div>
          </div>
        )}
        <div className="p-6">
          <TagList tags={post.tags} locale={locale} limit={3} />
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white mt-3 mb-2 leading-snug hover:text-brand transition-colors">
            <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{post.description}</p>
          <PostMeta author={post.author} timeLabel={timeLabel} />
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col bg-white dark:bg-[#1a0a04] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#501907] shadow-sm hover:shadow-md transition-shadow">
      {post.coverImage && (
        <Link href={`/${locale}/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
          <div className="relative h-44 w-full overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
        </Link>
      )}
      <div className="flex flex-col flex-1 p-5">
        <TagList tags={post.tags} locale={locale} limit={2} />
        <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mt-2 mb-2 leading-snug">
          <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-brand transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-1 mb-4">{post.description}</p>
        <PostMeta author={post.author} timeLabel={timeLabel} />
      </div>
    </article>
  );
}

function TagList({ tags, locale, limit }: { tags: string[]; locale: string; limit: number }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.slice(0, limit).map((tag) => (
        <Link key={tag} href={`/${locale}/blog/tags/${encodeURIComponent(tag)}`}
          className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand/10 text-brand hover:bg-brand hover:text-white transition-colors">
          {tag}
        </Link>
      ))}
    </div>
  );
}

function PostMeta({ author, timeLabel }: { author: string; timeLabel: string }) {
  return (
    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-[#501907]">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center text-brand text-[10px] font-bold">
          {author.charAt(0)}
        </div>
        <span className="font-medium text-gray-700 dark:text-gray-300">{author}</span>
      </div>
      <span className="text-brand/70">{timeLabel}</span>
    </div>
  );
}
