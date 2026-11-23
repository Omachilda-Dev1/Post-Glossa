"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeToggle from "./ThemeToggle";
import { formatDateline } from "@/lib/format";

export default function Header({ locale, dateline }: { locale: string; dateline: string }) {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [today, setToday] = useState(dateline);
  const isHome = pathname === `/${locale}`;

  // Pages are statically generated; refresh the dateline in the reader's own timezone.
  useEffect(() => { setToday(formatDateline(new Date(), locale)); }, [locale]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/news`, label: t("wire") },
    { href: `/${locale}/blog`, label: t("blog") },
    { href: `/${locale}/blog/tags`, label: t("tags") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    if (href === `/${locale}/blog`) return pathname.startsWith(href) && !pathname.startsWith(`${href}/tags`);
    return pathname.startsWith(href);
  };

  const searchLink = (
    <Link
      href={`/${locale}/search`}
      aria-label={t("search")}
      className="p-2 text-ink/70 hover:text-ink transition-colors"
    >
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
      </svg>
    </Link>
  );

  return (
    <header className="bg-paper">
      {/* Masthead: big on the front page, compact elsewhere */}
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <div className={`flex items-end justify-between gap-4 ${isHome ? "pt-6 pb-5 sm:pt-10 sm:pb-6" : "py-4"}`}>
          <div className="min-w-0">
            {isHome ? (
              <>
                <p className="kicker mb-3 hidden sm:block" suppressHydrationWarning>{today}</p>
                <Logo locale={locale} size="lg" />
                <p className="mt-3 font-serif italic text-base sm:text-lg text-muted">{tf("tagline")}</p>
              </>
            ) : (
              <Logo locale={locale} size="md" />
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <div className="hidden md:block"><LocaleSwitcher /></div>
            {searchLink}
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-ink/80"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Section nav on a double rule */}
      <nav aria-label="Main" className="hidden md:block border-y border-ink/90">
        <div className="mx-auto max-w-page px-4 sm:px-6 flex items-center gap-7 h-11">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative font-mono text-[12px] uppercase tracking-[0.14em] transition-colors h-full flex items-center ${
                isActive(link.href)
                  ? "text-ink after:absolute after:left-0 after:right-0 after:-bottom-px after:h-[3px] after:bg-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="md:hidden border-b border-ink/90" />

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-paper flex flex-col" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between px-4 py-4 border-b border-rule">
            <Logo locale={locale} size="sm" />
            <button onClick={() => setMobileOpen(false)} className="p-2 text-ink" aria-label="Close menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Main">
            {[...navLinks, { href: `/${locale}/search`, label: t("search") }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-4 border-b border-rule font-serif text-3xl tracking-[-0.01em] ${
                  isActive(link.href) ? "text-accent" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-5 border-t border-rule">
            <LocaleSwitcher mobile />
          </div>
        </div>
      )}
    </header>
  );
}
