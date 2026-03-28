# Postglossa

> Words without borders — a production-grade multilingual SEO blog platform.

Postglossa is a fully open-source, production-ready blog platform built to demonstrate what modern multilingual web development looks like at its best. The name comes from the Greek *poly* (many) and *glossa* (tongue) — a nod to the platform's core mission: making ideas accessible across language barriers.

The platform supports **7 languages** (English, French, German, Spanish, Portuguese, Japanese, and Chinese), ships with **20+ hand-crafted articles**, and is engineered for strong search engine visibility from day one. Every page is statically generated at build time, served with correct `hreflang` alternate tags, structured JSON-LD data, and Open Graph metadata — the full SEO stack, not just the basics.

Under the hood, Postglossa is built on Next.js 14's App Router with TypeScript throughout. Content lives in plain Markdown files — no database, no CMS, no vendor lock-in. The i18n layer uses `next-intl` for type-safe translations, and the routing follows the `/{locale}/blog/{slug}` convention that search engines reward. Dark mode, a reading progress indicator, tag filtering, full-text search, and share buttons are all included out of the box.

This project is equally useful as a **learning reference** for Next.js App Router patterns, a **starter template** for multilingual content sites, or a **production deployment** with your own content dropped in.

## Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + `@tailwindcss/typography`
- **Content**: Markdown via `gray-matter` + `next-mdx-remote`
- **i18n**: `next-intl` (en, fr, de, es, pt, ja, zh — 7 locales)
- **SEO**: Next.js Metadata API, JSON-LD, hreflang, `next-sitemap`
- **Fonts**: Playfair Display (serif headings) + Inter (body)

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

On first visit, the middleware redirects `/` → `/en` (default locale).

## Build & Sitemap

```bash
npm run build      # Next.js build
# postbuild runs next-sitemap automatically → generates /public/sitemap.xml + robots.txt
```

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` before deploying:

```env
NEXT_PUBLIC_SITE_URL=https://postglossa.com
NEXT_PUBLIC_SITE_NAME=Postglossa
```

## Architecture

```
app/[locale]/           ← locale-scoped layouts & pages
  layout.tsx            ← fonts, theme script, Header/Footer
  page.tsx              ← SSG homepage with WebSite JSON-LD
  blog/
    page.tsx            ← SSG + ISR (revalidate: 3600), paginated
    [slug]/page.tsx     ← SSG via generateStaticParams, Article JSON-LD
    tags/page.tsx       ← all tags listing
    tags/[tag]/page.tsx ← posts filtered by tag

content/{locale}/       ← Markdown posts (frontmatter + MDX body)
components/             ← Logo, Header, Footer, BlogCard, LocaleSwitcher,
                           ThemeToggle, ReadingProgress, JsonLd
lib/
  mdx.ts                ← fs-based post parsing (gray-matter, reading-time)
  seo.ts                ← metadata builders + JSON-LD helpers
messages/               ← i18n strings (en.json, fr.json)
```

## Rendering Strategy

| Route | Strategy |
|---|---|
| `/[locale]` | SSG |
| `/[locale]/blog` | SSG + ISR (1h) |
| `/[locale]/blog/[slug]` | SSG (`generateStaticParams`) |
| `/[locale]/blog/tags` | SSG |
| `/[locale]/blog/tags/[tag]` | SSG (`generateStaticParams`) |

## Content

Posts live in `content/{locale}/` (en, fr, de, es, pt, ja, zh). Each file requires this frontmatter:

```yaml
---
title: "Post Title"
description: "Meta description"
date: "2024-03-10"
author: "Author Name"
tags: ["tag1", "tag2"]
slug: "url-slug"
locale: "en"
coverImage: "https://..."
readingTime: 7
---
```

## SEO Features

- Dynamic `<title>` / `<meta description>` via Next.js Metadata API
- Open Graph + Twitter Card on every page (`og:site_name = "Postglossa"`)
- JSON-LD `Article` schema on post pages, `WebSite` schema on homepage
- `hreflang` alternate links on every page
- Canonical URLs
- XML sitemap + `robots.txt` via `next-sitemap` (runs as `postbuild`)
