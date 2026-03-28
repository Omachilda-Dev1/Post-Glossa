---
title: "Mehrsprachige Web-Apps mit Next.js erstellen"
description: "Ein praktischer Leitfaden zur Internationalisierung in Next.js 14 mit App Router, next-intl und hreflang-Tags für globales SEO."
date: "2024-02-20"
author: "Soren Lindqvist"
tags: ["nextjs", "i18n", "webentwicklung", "seo"]
slug: "mehrsprachige-apps-erstellen"
locale: "de"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
readingTime: 8
---

## Warum i18n von Anfang an wichtig ist

Internationalisierung ist eine jener Funktionen, die Entwickler ständig aufschieben — bis das Produkt live ist und die Refactoring-Kosten enorm sind. i18n von Anfang an in Ihre Architektur einzubauen ist weitaus günstiger als es nachträglich hinzuzufügen.

### URL-Struktur ist wichtig für SEO

Google behandelt `example.com/en/blog` und `example.com/de/blog` als separate Seiten. Das bedeutet doppelten indexierbaren Inhalt und die Möglichkeit, in mehreren Sprachmärkten gleichzeitig zu ranken.

```typescript
// middleware.ts — gesamten Traffic durch Locale-Präfix leiten
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "es"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

### next-intl einrichten

Die `next-intl`-Bibliothek integriert sich nahtlos mit dem App Router. Nachrichten befinden sich in JSON-Dateien, und der `useTranslations`-Hook bietet typsicheren Zugriff.

```typescript
// app/[locale]/page.tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("hero_title")}</h1>;
}
```

### hreflang: Das SEO-Signal, das Sie nicht überspringen können

Ohne `hreflang`-Tags könnte Google die falsche Sprachversion an Benutzer ausliefern.

```html
<link rel="alternate" hreflang="de" href="https://example.com/de/blog/artikel" />
<link rel="alternate" hreflang="en" href="https://example.com/en/blog/article" />
```

## Wichtige Überlegungen

- Übersetzungsschlüssel flach und beschreibend halten
- ICU-Nachrichtenformat für Plurale und Interpolation verwenden
- Immer eine Fallback-Locale bereitstellen
- Mit Pseudo-Lokalisierung testen, bevor echte Übersetzungen vorliegen

Gut gemachte Internationalisierung ist für Benutzer unsichtbar — sie sehen einfach Inhalte in ihrer Sprache.
