import Link from "next/link";

interface LogoProps {
  locale: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ locale, size = "md" }: LogoProps) {
  const boxSize = size === "sm" ? "w-7 h-7 text-xs rounded-lg" : size === "lg" ? "w-12 h-12 text-base rounded-2xl" : "w-9 h-9 text-sm rounded-xl";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link href={`/${locale}`} className="flex items-center gap-3 group" aria-label="Postglossa — Home">
      <span
        className={`flex items-center justify-center ${boxSize} text-white font-bold tracking-tight select-none`}
        style={{ background: "linear-gradient(135deg, #f54300 0%, #ff6a25 100%)" }}
        aria-hidden="true"
      >
        PG
      </span>
      <span className={`font-serif ${textSize} font-semibold text-gray-900 dark:text-white group-hover:text-brand transition-colors`}>
        Postglossa
      </span>
    </Link>
  );
}
