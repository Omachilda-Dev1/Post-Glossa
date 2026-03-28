---
title: "Building Multilingual Web Apps with Next.js"
description: "A practical guide to internationalisation in Next.js 14 using the App Router, next-intl, and hreflang tags for global SEO."
date: "2024-02-20"
author: "Soren Lindqvist"
tags: ["nextjs", "i18n", "web-development", "seo"]
slug: "building-multilingual-apps"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
readingTime: 8
---

## The Case for i18n from Day One

Internationalisation is one of those features developers perpetually defer — until the product is live and refactoring costs are enormous. Building i18n into your architecture from the start is far cheaper than retrofitting it later.

### URL Structure Matters for SEO

Google treats `example.com/en/blog` and `example.com/fr/blog` as separate pages. This means you get double the indexable content and can rank in multiple language markets simultaneously.

```typescript
// middleware.ts — route all traffic through locale prefix
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "es"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

### Setting Up next-intl

The `next-intl` library integrates cleanly with the App Router. Messages live in JSON files, and the `useTranslations` hook gives you type-safe access to them.

```typescript
// app/[locale]/page.tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("hero_title")}</h1>;
}
```

### hreflang: The SEO Signal You Can't Skip

Without `hreflang` tags, Google may serve the wrong language version to users. Add them to every page's `<head>`:

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/blog/post" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/blog/post" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/post" />
```

## Key Considerations

- Keep translation keys flat and descriptive — avoid deeply nested objects
- Use ICU message format for plurals and interpolation
- Always provide a fallback locale
- Test with pseudo-localisation before real translations arrive

Internationalisation done right is invisible to users — they simply see content in their language, and your SEO benefits quietly compound.
