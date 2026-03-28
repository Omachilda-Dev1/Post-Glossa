---
title: "Crear aplicaciones web multilingües con Next.js"
description: "Una guía práctica para la internacionalización en Next.js 14 con App Router, next-intl y etiquetas hreflang para SEO global."
date: "2024-02-20"
author: "Soren Lindqvist"
tags: ["nextjs", "i18n", "desarrollo-web", "seo"]
slug: "crear-apps-multilingues"
locale: "es"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
readingTime: 8
---

## Por qué el i18n importa desde el primer día

La internacionalización es una de esas funciones que los desarrolladores posponen perpetuamente — hasta que el producto está en vivo y los costos de refactorización son enormes.

### La estructura de URL importa para el SEO

Google trata `example.com/en/blog` y `example.com/es/blog` como páginas separadas. Esto significa el doble de contenido indexable y la posibilidad de posicionarse en múltiples mercados lingüísticos simultáneamente.

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "es", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

### Configurar next-intl

La biblioteca `next-intl` se integra perfectamente con el App Router. Los mensajes viven en archivos JSON y el hook `useTranslations` proporciona acceso con tipos.

```typescript
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("hero_title")}</h1>;
}
```

### hreflang: La señal SEO que no puedes omitir

Sin etiquetas `hreflang`, Google puede servir la versión de idioma incorrecta a los usuarios.

## Consideraciones clave

- Mantener las claves de traducción planas y descriptivas
- Usar formato de mensaje ICU para plurales e interpolación
- Siempre proporcionar una locale de respaldo
- Probar con pseudo-localización antes de que lleguen las traducciones reales
