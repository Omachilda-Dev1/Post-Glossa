import { useTranslations } from "next-intl";
import Link from "next/link";
import Logo from "./Logo";
import { locales, localeNames } from "@/i18n";
import { FEEDS } from "@/lib/news";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tw = useTranslations("wire");
  const year = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}/news`, label: tn("wire") },
    { href: `/${locale}/blog`, label: tn("blog") },
    { href: `/${locale}/blog/tags`, label: tn("tags") },
    { href: `/${locale}/search`, label: tn("search") },
    { href: `/${locale}/about`, label: tn("about") },
  ];

  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper">
      <div className="mx-auto max-w-page px-4 sm:px-6 py-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo locale={locale} size="md" />
            <p className="mt-4 max-w-sm font-serif text-lg leading-relaxed text-ink/75">{t("description")}</p>
          </div>

          <div className="md:col-span-2">
            <p className="kicker mb-4">{t("navigation")}</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] text-ink/80 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="kicker mb-4">{tw("sources")}</p>
            <ul className="grid grid-cols-1 gap-2">
              {FEEDS.map((f) => (
                <li key={f.source}>
                  <a href={f.home} target="_blank" rel="noopener noreferrer" className="text-[15px] text-ink/80 hover:text-accent transition-colors">
                    {f.source}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="kicker mb-4">{t("languages")}</p>
            <ul className="space-y-2.5">
              {locales.map((loc) => (
                <li key={loc}>
                  <Link
                    href={`/${loc}`}
                    hrefLang={loc}
                    className={`text-[15px] transition-colors ${loc === locale ? "text-accent" : "text-ink/80 hover:text-accent"}`}
                  >
                    {localeNames[loc]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-rule flex flex-col sm:flex-row gap-3 justify-between">
          <p className="kicker">{t("copyright", { year })}</p>
          <p className="kicker">{tw("footer_note")}</p>
        </div>
      </div>
    </footer>
  );
}
