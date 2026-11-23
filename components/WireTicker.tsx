import Link from "next/link";
import type { NewsItem } from "@/lib/news";

/** Thin running ticker of the latest headlines under the masthead. Pauses on hover. */
export default function WireTicker({ items, locale, label }: { items: NewsItem[]; locale: string; label: string }) {
  if (items.length === 0) return null;

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.id} className="flex items-center">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={hidden ? -1 : undefined}
            className="px-5 text-[13px] text-ink/85 hover:text-accent transition-colors whitespace-nowrap"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted mr-2">{item.source}</span>
            {item.title}
          </a>
          <span className="text-rule" aria-hidden="true">/</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="border-b border-rule bg-card">
      <div className="mx-auto max-w-page flex items-stretch">
        <Link
          href={`/${locale}/news`}
          className="shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2 border-r border-rule font-mono text-[11px] uppercase tracking-[0.14em] text-accent hover:bg-accent hover:text-paper transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" aria-hidden="true" />
          {label}
        </Link>
        <div className="group relative flex-1 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </div>
  );
}
