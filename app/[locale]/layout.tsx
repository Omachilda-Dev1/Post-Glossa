import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WireTicker from "@/components/WireTicker";
import { getNews } from "@/lib/news";
import { formatDateline } from "@/lib/format";
import "../globals.css";

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com"),
  title: { default: "Postglossa", template: "%s · Postglossa" },
  description: "An independent notebook on technology and the world, with a live wire of tech and world headlines.",
  openGraph: { siteName: "Postglossa" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const [messages, t, ticker] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: "wire" }),
    getNews({ limit: 14 }),
  ]);

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme'),p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&p))document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-ink focus:text-paper focus:px-3 focus:py-2">
          Skip to content
        </a>
        <NextIntlClientProvider messages={messages}>
          <WireTicker items={ticker} locale={locale} label={t("live")} />
          <Header locale={locale} dateline={formatDateline(new Date(), locale)} />
          <main id="main" className="flex-1">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
