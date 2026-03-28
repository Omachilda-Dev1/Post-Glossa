"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, type Locale } from "@/i18n";

export default function LocaleSwitcher({ mobile = false }: { mobile?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Language</p>
        <div className="grid grid-cols-2 gap-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                loc === locale ? "bg-brand text-white" : "bg-gray-100 dark:bg-[#2a0e05] text-gray-700 dark:text-gray-300 hover:bg-brand/10 hover:text-brand"
              }`}
            >
              <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-white/20">{loc.toUpperCase()}</span>
              <span>{localeNames[loc]}</span>
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a0e05] transition-colors"
      >
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand">{locale.toUpperCase()}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <svg className={`w-3.5 h-3.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-[#1a0a04] rounded-2xl shadow-xl border border-gray-100 dark:border-[#501907] overflow-hidden z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                loc === locale ? "bg-brand/10 text-brand font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a0e05]"
              }`}
            >
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand/10 text-brand w-8 text-center">{loc.toUpperCase()}</span>
              <span>{localeNames[loc]}</span>
              {loc === locale && (
                <svg className="w-3.5 h-3.5 ml-auto text-brand" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
