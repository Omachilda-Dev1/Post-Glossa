import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/mdx";
import { FEEDS } from "@/lib/news";
import { locales, localeNames } from "@/i18n";

interface Props { params: { locale: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildPageMetadata(
    "About",
    "Who writes Postglossa, what the Wire is, and how the two fit together.",
    params.locale,
    "/about"
  );
}

const contributors = [
  { name: "Elena Marchetti", beat: "Language & localisation", note: "Edits the site. Reads in six languages, writes in three, and argues about Oxford commas in all of them." },
  { name: "Soren Lindqvist", beat: "Engineering", note: "TypeScript, Docker, databases. The person who reads the changelog so you don't have to." },
  { name: "Amara Osei", beat: "Search & distribution", note: "How good work gets found, and why most SEO advice is ten years out of date." },
  { name: "Yuki Tanaka", beat: "Content strategy", note: "Former translator. Covers what actually changes when an idea crosses from Japanese to English." },
];

export default function AboutPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const postCount = locales.reduce((n, l) => n + getAllPosts(l).length, 0);
  const tech = FEEDS.filter((f) => f.desk === "tech").map((f) => f.source);
  const world = FEEDS.filter((f) => f.desk === "world").map((f) => f.source);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 pt-10">
      <header className="pb-10 border-b border-rule grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="kicker-accent">About</p>
          <h1 className="mt-3 font-serif text-5xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.03em] leading-[1.02] text-ink text-balance">
            A notebook, with the window open.
          </h1>
        </div>
      </header>

      <div className="grid gap-12 py-12 lg:grid-cols-12">
        <div className="lg:col-span-7 prose max-w-none">
          <p className="!text-[1.35rem] !leading-relaxed text-ink">
            Postglossa started as a place to write down what I was learning about building software for people who
            don&apos;t all speak the same language. It still is. The essays here are slow on purpose: one idea,
            worked through properly, with the code and the caveats left in.
          </p>
          <p>
            The problem with writing slowly is that the world doesn&apos;t. I kept a dozen news tabs open beside
            every draft, so I built the thing I wanted instead: <Link href={`/${locale}/news`}>the Wire</Link>.
            It pulls headlines from newsrooms I already read, puts tech and world news side by side, and refreshes
            itself every ten minutes. Nothing on the Wire is rewritten or summarised by a machine. Every headline
            links straight to the people who reported it.
          </p>
          <p>
            So the site has two speeds. The journal is what I think. The Wire is what&apos;s happening. Read either,
            or read one beside the other, which is how I use it.
          </p>
          <h2>How the Wire works</h2>
          <p>
            It reads public RSS feeds from {FEEDS.length} sources, merges them, drops duplicates, and sorts
            newest first. There&apos;s no tracking and no paid news API, so there&apos;s nothing to rate-limit
            or expire. If a source goes down, it&apos;s skipped until it comes back. The same feed is available as
            JSON at <code>/api/news</code> if you want to build on it.
          </p>
          <h2>Who writes here</h2>
          <p>
            Mostly me, with a few people whose work I trust. Essays appear in up to {locales.length} languages,
            adapted by hand rather than machine-translated, which is why not every piece exists in every language.
          </p>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9 space-y-10">
          <dl className="grid grid-cols-3 gap-4 border-y border-rule py-5">
            {[
              { k: "Essays", v: postCount },
              { k: "Languages", v: locales.length },
              { k: "Sources", v: FEEDS.length },
            ].map((s) => (
              <div key={s.k}>
                <dt className="kicker">{s.k}</dt>
                <dd className="mt-1 font-serif text-4xl text-ink tabular-nums">{s.v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="kicker mb-3">Tech desk</p>
            <p className="font-serif text-lg leading-relaxed text-ink/85">{tech.join(", ")}</p>
            <p className="kicker mb-3 mt-6">World desk</p>
            <p className="font-serif text-lg leading-relaxed text-ink/85">{world.join(", ")}</p>
          </div>

          <div>
            <p className="kicker mb-3">Read in</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {locales.map((l) => (
                <li key={l}>
                  <Link href={`/${l}/blog`} hrefLang={l} lang={l} className={`text-[15px] ${l === locale ? "text-accent" : "text-ink/80 hover:text-accent"}`}>
                    {localeNames[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section aria-labelledby="contributors" className="mt-8">
        <div className="section-head">
          <h2 id="contributors" className="font-serif text-2xl sm:text-[1.75rem] tracking-[-0.01em] text-ink">Contributors</h2>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {contributors.map((c) => (
            <li key={c.name} className="py-5 border-b border-rule flex gap-4">
              <div className="h-12 w-12 shrink-0 bg-ink text-paper flex items-center justify-center font-serif text-xl" aria-hidden="true">
                {c.name.charAt(0)}
              </div>
              <div>
                <p className="font-serif text-xl text-ink">{c.name}</p>
                <p className="kicker-accent mt-0.5">{c.beat}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
