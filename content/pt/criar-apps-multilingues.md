---
title: "Criar aplicações web multilíngues com Next.js"
description: "Um guia prático para internacionalização no Next.js 14 com App Router, next-intl e tags hreflang para SEO global."
date: "2024-02-20"
author: "Soren Lindqvist"
tags: ["nextjs", "i18n", "desenvolvimento-web", "seo"]
slug: "criar-apps-multilingues"
locale: "pt"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
readingTime: 8
---

## Por que o i18n importa desde o primeiro dia

A internacionalização é uma daquelas funcionalidades que os desenvolvedores adiam perpetuamente — até que o produto está no ar e os custos de refatoração são enormes.

### A estrutura de URL importa para o SEO

O Google trata `example.com/en/blog` e `example.com/pt/blog` como páginas separadas. Isso significa o dobro de conteúdo indexável e a possibilidade de ranquear em múltiplos mercados linguísticos simultaneamente.

```typescript
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "es", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

### Configurar next-intl

A biblioteca `next-intl` se integra perfeitamente com o App Router. As mensagens ficam em arquivos JSON e o hook `useTranslations` fornece acesso com tipos.

## Considerações principais

- Manter as chaves de tradução planas e descritivas
- Usar formato de mensagem ICU para plurais e interpolação
- Sempre fornecer uma locale de fallback
- Testar com pseudo-localização antes das traduções reais chegarem
