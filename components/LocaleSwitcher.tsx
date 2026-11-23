"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, type Locale } from "@/i18n";

export default function LocaleSwitcher({ mobile = false }: { mobile?: boolean }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("locale_switcher");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function switchLocale(next: Locale) {
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
    setOpen(false);
  }

  if (mobile) {
    return (
      <div>
        <p className="kicker mb-3">{t("label")}</p>
        <div className="flex flex-wrap gap-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              lang={loc}
              className={`px-3 py-1.5 text-sm border transition-colors ${
                loc === locale ? "bg-ink text-paper border-ink" : "border-rule text-ink/80"
              }`}
            >
              {localeNames[loc]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("choose")}
        className="flex items-center gap-1.5 px-2 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-ink/70 hover:text-ink transition-colors"
      >
        {locale}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul role="listbox" aria-label={t("label")} className="absolute right-0 top-full mt-1 w-44 bg-card border border-ink/80 shadow-[4px_4px_0_rgb(var(--ink)/0.12)] z-50 py-1">
          {locales.map((loc) => (
            <li key={loc}>
              <button
                role="option"
                aria-selected={loc === locale}
                lang={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${
                  loc === locale ? "text-accent" : "text-ink/85 hover:bg-ink/5"
                }`}
              >
                <span>{localeNames[loc]}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{loc}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
