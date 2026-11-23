import Link from "next/link";

interface LogoProps {
  locale: string;
  size?: "sm" | "md" | "lg";
}

/** Wordmark. The accent full stop is the only ornament. */
export default function Logo({ locale, size = "md" }: LogoProps) {
  const textSize =
    size === "sm" ? "text-xl" : size === "lg" ? "text-5xl sm:text-6xl lg:text-7xl" : "text-2xl";

  return (
    <Link href={`/${locale}`} className="inline-block" aria-label="Postglossa, home">
      <span className={`font-serif ${textSize} font-semibold tracking-[-0.03em] leading-none text-ink`}>
        Postglossa<span className="text-accent">.</span>
      </span>
    </Link>
  );
}
