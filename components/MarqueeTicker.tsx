"use client";

interface MarqueeTickerProps {
  text: string;
}

export default function MarqueeTicker({ text }: MarqueeTickerProps) {
  const repeated = text.repeat(4);
  return (
    <div className="relative overflow-hidden py-3 bg-brand/5 dark:bg-brand/10 border-y border-brand/10">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-sm font-medium text-brand/70 dark:text-brand-300 pr-0">{repeated}</span>
        <span className="text-sm font-medium text-brand/70 dark:text-brand-300 pr-0" aria-hidden="true">{repeated}</span>
      </div>
    </div>
  );
}
