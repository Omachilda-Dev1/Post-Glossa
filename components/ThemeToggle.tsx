"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  const t = useTranslations("theme");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* private mode */ }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? t("toggle_light") : t("toggle_dark")}
      className="p-2 text-ink/70 hover:text-ink transition-colors"
    >
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}
