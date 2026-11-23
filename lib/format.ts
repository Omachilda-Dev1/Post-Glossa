const INTL_LOCALES: Record<string, string> = {
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  pt: "pt-BR",
  ja: "ja-JP",
  zh: "zh-CN",
};

export function intlLocale(locale: string): string {
  return INTL_LOCALES[locale] ?? "en-GB";
}

export function formatDate(date: string | Date, locale: string, style: "long" | "short" = "long"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(intlLocale(locale), {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  });
}

export function formatDateline(date: Date, locale: string): string {
  return date.toLocaleDateString(intlLocale(locale), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function timeAgo(iso: string, locale: string, now = Date.now()): string {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: "auto", style: "short" });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  return rtf.format(Math.round(diff / 86400), "day");
}
