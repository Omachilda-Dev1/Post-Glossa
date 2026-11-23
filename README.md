# Postglossa

> Technology and the world, read slowly.

Postglossa is an independent, multilingual blog with two speeds:

- **The Journal**: long-form essays on software, language, and the web, written in Markdown and published in up to 7 languages (en, fr, de, es, pt, ja, zh).
- **The Wire**: a live feed of tech and world headlines pulled from public newsroom RSS feeds and refreshed automatically every 10 minutes. It needs no API key, database, or cron job.

## Stack

- **Framework**: Next.js 14 (App Router, TypeScript), statically generated with incremental regeneration
- **Styling**: Tailwind CSS + `@tailwindcss/typography`, theme tokens as CSS variables (light and dark)
- **Fonts**: Newsreader (serif), Instrument Sans (UI), JetBrains Mono (labels and code)
- **Content**: Markdown via `gray-matter` + `next-mdx-remote`
- **i18n**: `next-intl`
- **News**: `fast-xml-parser` over public RSS/Atom feeds

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + sitemap
```

Set `NEXT_PUBLIC_SITE_URL` to your deployed URL (see `.env.production`).

## The Wire

The Wire is built in [`lib/news.ts`](lib/news.ts):

1. It fetches each feed in `FEEDS` through Next's data cache (`revalidate: 600`).
2. It normalises RSS and Atom items into one shape: title, link, summary, image, source, desk, and date.
3. It removes duplicates by link and title, sorts newest first, and caps each source so one busy feed can't take over a list.
4. If a feed fails, it is skipped. It never breaks the page.

Pages that show the Wire regenerate in the background every 10 minutes. The homepage sidebar also polls `/api/news` every 5 minutes, so a tab left open picks up new headlines.

**Sources:** Ars Technica, TechCrunch, Wired, BBC Technology, The Guardian Tech, and Hacker News on the tech desk; BBC World, The Guardian World, Al Jazeera, and NPR World on the world desk. To add one, append to `FEEDS`:

```ts
{ source: "Reuters Tech", desk: "tech", url: "https://…/rss", home: "https://…" }
```

### JSON API

```
GET /api/news?desk=tech|world&source=BBC%20World&limit=30&images=1
```

```json
{ "updatedAt": "…", "count": 30, "items": [{ "id", "title", "link", "summary", "image", "source", "desk", "published" }] }
```

Every headline links to the original publisher. Summaries are the publisher's own RSS description, trimmed.

## Writing an essay

Add a Markdown file to `content/<locale>/`:

```md
---
title: "Docker for Developers"
description: "One-paragraph summary used on cards and in meta tags."
date: "2024-05-10"
author: "Soren Lindqvist"
tags: ["docker", "devops"]
slug: "docker-for-developers"
locale: "en"
coverImage: "https://images.unsplash.com/…"
featured: true   # optional: pins it as the front-page lead
---
```

Author bios live in `AUTHOR_BIOS` in [`lib/mdx.ts`](lib/mdx.ts).

## Routes

| Route | What it is |
| --- | --- |
| `/{locale}` | Front page: lead essay, live Wire sidebar, tech and world desks, more essays |
| `/{locale}/news` | The full Wire, filterable by desk (`?desk=`) and source (`?source=`) |
| `/{locale}/blog` | The Journal |
| `/{locale}/blog/{slug}` | Essay, with a "Meanwhile" rail of live tech headlines |
| `/{locale}/blog/tags` | Topics |
| `/{locale}/search` | Client-side search (`?q=` supported) |
| `/api/news` | Wire JSON |

## Design

An editorial, newsprint look: warm paper background, ink text, hairline rules, and one vermilion accent. Colours are CSS variables in [`app/globals.css`](app/globals.css) (`--paper`, `--ink`, `--muted`, `--rule`, `--accent`), redefined under `.dark`, and exposed to Tailwind as `bg-paper`, `text-ink`, `text-accent`, and so on. Dark mode follows the system setting and can be toggled from the header.

## Deploying

Deploys to Vercel with no extra configuration. On Vercel the Wire regenerates in the background every 10 minutes. With `npm run dev`, feeds are fetched on every request.

## SEO

- Metadata API titles and descriptions, Open Graph, and Twitter cards
- JSON-LD `Article` on essays and `WebSite` with a `SearchAction` on the homepage
- `hreflang` alternates (for essays, only languages where that slug exists)
- Canonical URLs, an XML sitemap, and `robots.txt` via `next-sitemap`
