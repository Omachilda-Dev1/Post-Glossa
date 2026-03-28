# Postglossa

> Words without borders — a production-grade multilingual SEO blog platform.

## Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + `@tailwindcss/typography`
- **Content**: Markdown via `gray-matter` + `next-mdx-remote`
- **i18n**: `next-intl` (en / fr)
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

Posts live in `content/en/` and `content/fr/`. Each file requires this frontmatter:

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
