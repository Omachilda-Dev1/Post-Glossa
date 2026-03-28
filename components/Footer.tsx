"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Logo from "./Logo";
import { locales, localeNames } from "@/i18n";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const year = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}`, label: tn("home") },
    { href: `/${locale}/blog`, label: tn("blog") },
    { href: `/${locale}/blog/tags`, label: tn("tags") },
    { href: `/${locale}/search`, label: tn("search") },
    { href: `/${locale}/about`, label: tn("about") },
  ];

  return (
    <footer className="relative border-t border-gray-100 dark:border-[#501907] bg-white dark:bg-[#1a0a04] mt-auto overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo locale={locale} size="md" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed max-w-xs">
              {t("description")}
            </p>
            <p className="mt-4 text-xs text-brand font-medium tracking-wide flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {t("made_with")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              {t("navigation")}
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand dark:hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
              {t("languages")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}`}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    loc === locale
                      ? "text-brand font-medium"
                      : "text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand"
                  }`}
                >
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand">{loc.toUpperCase()}</span>
                  <span>{localeNames[loc]}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-[#501907] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {t("copyright", { year })}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 italic">
            &ldquo;{t("tagline")}&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
