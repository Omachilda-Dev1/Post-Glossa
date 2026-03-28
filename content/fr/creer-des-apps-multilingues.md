---
title: "Créer des applications web multilingues avec Next.js"
description: "Un guide pratique pour l'internationalisation dans Next.js 14 avec l'App Router, next-intl et les balises hreflang pour le référencement mondial."
date: "2024-02-20"
author: "Soren Lindqvist"
tags: ["nextjs", "i18n", "développement-web", "seo"]
slug: "creer-des-apps-multilingues"
locale: "fr"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
readingTime: 8
---

## Pourquoi intégrer l'i18n dès le départ

L'internationalisation est l'une de ces fonctionnalités que les développeurs reportent perpétuellement — jusqu'à ce que le produit soit en ligne et que les coûts de refactorisation soient énormes. Intégrer l'i18n dans votre architecture dès le départ est bien moins coûteux que de l'ajouter après coup.

### La structure des URL est importante pour le SEO

Google traite `example.com/en/blog` et `example.com/fr/blog` comme des pages distinctes. Cela signifie que vous obtenez le double du contenu indexable et pouvez vous classer sur plusieurs marchés linguistiques simultanément.

```typescript
// middleware.ts — router tout le trafic via le préfixe de locale
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "es"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

### Configurer next-intl

La bibliothèque `next-intl` s'intègre parfaitement avec l'App Router. Les messages se trouvent dans des fichiers JSON, et le hook `useTranslations` vous donne un accès typé à ces messages.

```typescript
// app/[locale]/page.tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("hero_title")}</h1>;
}
```

### hreflang : le signal SEO incontournable

Sans balises `hreflang`, Google peut servir la mauvaise version linguistique aux utilisateurs. Ajoutez-les dans le `<head>` de chaque page :

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/blog/article" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/blog/article" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/blog/article" />
```

## Points clés à retenir

- Gardez les clés de traduction plates et descriptives — évitez les objets profondément imbriqués
- Utilisez le format de message ICU pour les pluriels et l'interpolation
- Fournissez toujours une locale de secours
- Testez avec une pseudo-localisation avant l'arrivée des vraies traductions

Une internationalisation bien faite est invisible pour les utilisateurs — ils voient simplement le contenu dans leur langue, et vos bénéfices SEO s'accumulent silencieusement.
