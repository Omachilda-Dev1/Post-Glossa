---
title: "Fundamentos de SEO para aplicações web modernas"
description: "Princípios SEO essenciais que todo desenvolvedor deveria conhecer: dados estruturados, Core Web Vitals, HTML semântico e a API Metadata do Next.js."
date: "2024-03-10"
author: "Amara Osei"
tags: ["seo", "desenvolvimento-web", "desempenho"]
slug: "fundamentos-seo-2024"
locale: "pt"
coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80"
readingTime: 7
---

## SEO é engenharia, não magia

A otimização para mecanismos de busca tem reputação de ser misteriosa. Na realidade, os fundamentos são problemas de engenharia simples: páginas rápidas, marcação semântica, metadados precisos e conteúdo confiável.

### A API Metadata do Next.js

Next.js 14 inclui uma API `Metadata` de primeira classe que gera tags `<head>` em tempo de compilação para páginas estáticas.

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug, params.locale);
  return {
    title: post.title,
    description: post.description,
    openGraph: { siteName: "Postglossa", type: "article" },
  };
}
```

### Dados estruturados JSON-LD

Dados estruturados ajudam os mecanismos de busca a entender seu conteúdo e podem desbloquear resultados ricos.

### Lista de verificação de Core Web Vitals

- **LCP**: Otimizar imagens hero com `<Image>` e prop `priority`
- **CLS**: Sempre definir `width` e `height` explícitos em imagens
- **INP**: Minimizar JavaScript no caminho crítico

Os desenvolvedores que tratam SEO como uma preocupação de primeira classe desde o início superam consistentemente aqueles que o adicionam depois.
