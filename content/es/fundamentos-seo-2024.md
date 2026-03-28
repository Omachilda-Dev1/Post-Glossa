---
title: "Fundamentos de SEO para aplicaciones web modernas"
description: "Principios SEO esenciales que todo desarrollador debería conocer: datos estructurados, Core Web Vitals, HTML semántico y la API Metadata de Next.js."
date: "2024-03-10"
author: "Amara Osei"
tags: ["seo", "desarrollo-web", "rendimiento"]
slug: "fundamentos-seo-2024"
locale: "es"
coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80"
readingTime: 7
---

## El SEO es ingeniería, no magia

La optimización para motores de búsqueda tiene reputación de ser misteriosa. En realidad, los fundamentos son problemas de ingeniería sencillos: páginas rápidas, marcado semántico, metadatos precisos y contenido confiable.

### La API Metadata de Next.js

Next.js 14 incluye una API `Metadata` de primera clase que genera etiquetas `<head>` en tiempo de compilación para páginas estáticas.

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug, params.locale);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      siteName: "Postglossa",
      type: "article",
    },
  };
}
```

### Datos estructurados JSON-LD

Los datos estructurados ayudan a los motores de búsqueda a entender tu contenido y pueden desbloquear resultados enriquecidos.

### Lista de verificación de Core Web Vitals

- **LCP**: Optimizar imágenes hero con `<Image>` y prop `priority`
- **CLS**: Siempre establecer `width` y `height` explícitos en imágenes
- **INP**: Minimizar JavaScript en la ruta crítica

Los desarrolladores que tratan el SEO como una preocupación de primer orden desde el principio superan consistentemente a quienes lo agregan después.
