---
title: "SEO-Grundlagen für moderne Web-Apps"
description: "Kern-SEO-Prinzipien, die jeder Entwickler kennen sollte: strukturierte Daten, Core Web Vitals, semantisches HTML und die Next.js Metadata API."
date: "2024-03-10"
author: "Amara Osei"
tags: ["seo", "webentwicklung", "performance"]
slug: "seo-grundlagen-2024"
locale: "de"
coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80"
readingTime: 7
---

## SEO ist Ingenieurwesen, keine Magie

Suchmaschinenoptimierung hat den Ruf, mysteriös zu sein. In Wirklichkeit sind die Grundlagen einfache Ingenieurprobleme: schnelle Seiten, semantisches Markup, genaue Metadaten und vertrauenswürdige Inhalte.

### Die Next.js Metadata API

Next.js 14 liefert eine erstklassige `Metadata`-API, die `<head>`-Tags zur Build-Zeit für statische Seiten und zur Anforderungszeit für dynamische generiert.

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug, params.locale);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      siteName: "Postglossa",
      type: "article",
    },
  };
}
```

### JSON-LD Strukturierte Daten

Strukturierte Daten helfen Suchmaschinen, Ihre Inhalte zu verstehen und können Rich Results freischalten.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "SEO-Grundlagen für moderne Web-Apps",
  "author": { "@type": "Person", "name": "Amara Osei" },
  "publisher": { "@type": "Organization", "name": "Postglossa" }
}
```

### Core Web Vitals Checkliste

- **LCP**: Hero-Bilder mit `<Image>` und `priority`-Prop optimieren
- **CLS**: Immer explizite `width` und `height` bei Bildern setzen
- **INP**: JavaScript auf dem kritischen Pfad minimieren

Entwickler, die SEO von Anfang an als erstklassige Priorität behandeln, übertreffen konsequent diejenigen, die es nachträglich hinzufügen.
