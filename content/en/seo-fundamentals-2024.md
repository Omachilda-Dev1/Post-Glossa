---
title: "SEO Fundamentals for Modern Web Apps"
description: "Core SEO principles every developer should know: structured data, Core Web Vitals, semantic HTML, and the Next.js Metadata API."
date: "2024-03-10"
author: "Amara Osei"
tags: ["seo", "web-development", "performance"]
slug: "seo-fundamentals-2024"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80"
readingTime: 7
---

## SEO Is Engineering, Not Magic

Search engine optimisation has a reputation for being mysterious. In reality, the fundamentals are straightforward engineering problems: fast pages, semantic markup, accurate metadata, and trustworthy content.

### The Next.js Metadata API

Next.js 14 ships a first-class `Metadata` API that generates `<head>` tags at build time for static pages and at request time for dynamic ones.

```typescript
// app/[locale]/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug, params.locale);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage }],
      type: "article",
      siteName: "Postglossa",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}
```

### JSON-LD Structured Data

Structured data helps search engines understand your content and can unlock rich results (article cards, breadcrumbs, sitelinks search).

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SEO Fundamentals for Modern Web Apps",
  "author": { "@type": "Person", "name": "Amara Osei" },
  "datePublished": "2024-03-10",
  "publisher": {
    "@type": "Organization",
    "name": "Postglossa"
  }
}
```

### Core Web Vitals Checklist

- **LCP** (Largest Contentful Paint): Optimise hero images with `<Image>` and `priority` prop
- **CLS** (Cumulative Layout Shift): Always set explicit `width` and `height` on images
- **INP** (Interaction to Next Paint): Minimise JavaScript on the critical path

### Semantic HTML Still Matters

Search engines use document structure to understand content hierarchy. Use `<article>`, `<header>`, `<nav>`, `<main>`, and `<footer>` correctly — not just for SEO, but for accessibility too.

The developers who treat SEO as a first-class concern from day one consistently outrank those who bolt it on later.
