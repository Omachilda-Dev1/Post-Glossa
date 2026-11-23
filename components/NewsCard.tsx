import type { NewsItem } from "@/lib/news";
import TimeAgo from "./TimeAgo";

interface Props {
  item: NewsItem;
  locale: string;
  variant?: "card" | "row" | "compact";
  showSummary?: boolean;
}

/** A wire story. Always links out to the original publisher. */
export default function NewsCard({ item, locale, variant = "card", showSummary = true }: Props) {
  const meta = (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 kicker">
      <span className="text-ink/80">{item.source}</span>
      <span aria-hidden="true">·</span>
      <TimeAgo iso={item.published} locale={locale} />
    </div>
  );

  if (variant === "compact") {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="group block py-3.5 border-b border-rule last:border-b-0">
        {meta}
        <h3 className="mt-1.5 font-serif text-[1.05rem] leading-snug text-ink text-pretty">
          <span className="headline-link">{item.title}</span>
        </h3>
      </a>
    );
  }

  if (variant === "row") {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[1fr_auto] gap-5 py-5 border-b border-rule">
        <div className="min-w-0">
          {meta}
          <h3 className="mt-2 font-serif text-xl leading-snug text-ink text-pretty">
            <span className="headline-link">{item.title}</span>
          </h3>
          {showSummary && item.summary && (
            <p className="mt-2 text-[15px] leading-relaxed text-muted line-clamp-2">{item.summary}</p>
          )}
        </div>
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-36 sm:h-24 object-cover bg-rule/50"
          />
        )}
      </a>
    );
  }

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="group flex flex-col">
      <div className="relative aspect-[3/2] overflow-hidden bg-rule/50 mb-3">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-4">
            <span className="font-serif text-2xl italic text-muted/60">{item.source}</span>
          </div>
        )}
      </div>
      {meta}
      <h3 className="mt-2 font-serif text-lg leading-snug text-ink text-pretty">
        <span className="headline-link">{item.title}</span>
      </h3>
      {showSummary && item.summary && (
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">{item.summary}</p>
      )}
    </a>
  );
}
