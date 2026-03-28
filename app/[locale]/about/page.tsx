import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { locales, localeNames } from "@/i18n";

interface Props { params: { locale: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://postglossa.com";
  return {
    ...buildPageMetadata("About Postglossa", "Words without borders — our story, mission, and the team behind Postglossa.", params.locale, "/about"),
    alternates: { canonical: `${siteUrl}/${params.locale}/about`, languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}/about`])) },
  };
}

const team = [
  { name: "Elena Marchetti", role: "Founder & Editor-in-Chief", avatar: "EM", bio: "Polyglot and linguist. Elena speaks 6 languages and believes every language is a window into a different world.", langs: ["EN","FR","DE","ES","IT","JA"] },
  { name: "Soren Lindqvist", role: "Lead Developer", avatar: "SL", bio: "Full-stack engineer obsessed with multilingual web architecture. Built Postglossa's i18n engine from the ground up.", langs: ["EN","DE","SV"] },
  { name: "Amara Osei", role: "SEO & Growth", avatar: "AO", bio: "Digital strategist with a passion for making multilingual content discoverable across search engines.", langs: ["EN","FR"] },
  { name: "Yuki Tanaka", role: "Content Director", avatar: "YT", bio: "Former translator turned content strategist. Ensures every article resonates authentically across cultures.", langs: ["JA","EN","ZH"] },
];

const values = [
  {
    title: "Language is Identity",
    desc: "Every language carries a unique worldview. We celebrate linguistic diversity as a fundamental human treasure.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    title: "Knowledge Without Borders",
    desc: "Ideas should flow freely across languages. We break down barriers so insights reach every corner of the world.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>,
  },
  {
    title: "Quality Over Quantity",
    desc: "We publish fewer articles, but each one is crafted with care, depth, and respect for the reader's time.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  },
  {
    title: "Community First",
    desc: "Postglossa is built by and for language lovers, developers, and curious minds from every culture.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const milestones = [
  { year: "2022", event: "Postglossa founded with 2 languages and 10 articles" },
  { year: "2023", event: "Expanded to 5 languages, reached 50,000 monthly readers" },
  { year: "2024", event: "Launched 7-language platform with full SEO infrastructure" },
  { year: "2025", event: "Open-sourced the multilingual blog engine on GitHub" },
];

const langCodes: Record<string, string> = { EN: "English", FR: "Français", DE: "Deutsch", ES: "Español", IT: "Italiano", JA: "日本語", ZH: "中文", SV: "Svenska" };

export default function AboutPage({ params }: Props) {
  const locale = params.locale;
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-white dark:bg-gray-950 py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-medium mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Our Story
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            About <span className="gradient-text">Postglossa</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We believe language is the most powerful technology ever invented. Postglossa exists to celebrate it — in every tongue, across every border.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {locales.map((loc) => (
              <span key={loc} className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold border border-brand/20">
                {localeNames[loc]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-4 block">Our Mission</span>
              <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">Words without borders, ideas without limits</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">Postglossa was born from a simple frustration: the best ideas in the world are locked behind language barriers. A breakthrough insight published in Japanese never reaches a Spanish speaker.</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">Every article is crafted with care in multiple languages — not machine-translated, but thoughtfully adapted for each culture and context.</p>
              <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-medium rounded-xl hover:bg-brand-700 transition-colors">
                Read our articles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-lg">
              <svg className="w-10 h-10 text-brand/30 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
              <blockquote className="font-serif text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-6">The limits of my language mean the limits of my world.</blockquote>
              <cite className="text-sm text-gray-500 not-italic">— Ludwig Wittgenstein</cite>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-4 block">What We Stand For</span>
            <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">Our values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">{v.icon}</div>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-4 block">The People</span>
            <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-4">Meet the team</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">A small, passionate team of language lovers, engineers, and storytellers spread across the globe.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">{m.avatar}</div>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-1">{m.name}</h3>
                <p className="text-xs font-semibold text-brand mb-3">{m.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{m.bio}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {m.langs.map((l) => (
                    <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand font-semibold">{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-4 block">Global Reach</span>
            <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white mb-4">7 languages, one platform</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {locales.map((loc) => (
              <Link key={loc} href={`/${loc}/blog`} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-brand hover:bg-brand/5 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{loc.toUpperCase()}</span>
                <span className="text-[10px] text-gray-400 text-center">{localeNames[loc]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-4 block">Our Journey</span>
            <h2 className="font-serif text-4xl font-bold text-gray-900 dark:text-white">Milestones</h2>
          </div>
          <div className="relative space-y-6">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-brand/20" />
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10 relative shadow-lg shadow-brand/20">{m.year}</div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 flex-1 border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-12 border border-gray-100 dark:border-gray-800">
            <div className="w-16 h-16 rounded-2xl bg-brand mx-auto mb-6 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand/20">PG</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-4">Start exploring</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Dive into our collection of multilingual articles on language, technology, and culture.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/blog`} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand text-white font-semibold rounded-2xl hover:bg-brand-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Browse articles
              </Link>
              <Link href={`/${locale}/blog/tags`} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                Explore topics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
