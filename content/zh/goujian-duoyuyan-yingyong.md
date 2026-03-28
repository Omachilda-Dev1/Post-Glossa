---
title: "使用Next.js构建多语言网络应用"
description: "使用App Router、next-intl和hreflang标签在Next.js 14中进行国际化的实践指南，用于全球SEO。"
date: "2024-02-20"
author: "Soren Lindqvist"
tags: ["nextjs", "i18n", "网页开发", "seo"]
slug: "goujian-duoyuyan-yingyong"
locale: "zh"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
readingTime: 8
---

## 为什么从第一天起i18n就很重要

国际化是开发者永远推迟的功能之一——直到产品上线，重构成本变得巨大。从一开始就将i18n构建到架构中，比事后改造要便宜得多。

### URL结构对SEO很重要

Google将`example.com/en/blog`和`example.com/zh/blog`视为独立页面。这意味着您可以获得双倍的可索引内容，并可以同时在多个语言市场排名。

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "es", "pt", "ja", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

### 设置next-intl

`next-intl`库与App Router无缝集成。消息存储在JSON文件中，`useTranslations`钩子提供类型安全的访问。

```typescript
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("hero_title")}</h1>;
}
```

## 关键注意事项

- 保持翻译键扁平且具有描述性
- 对复数和插值使用ICU消息格式
- 始终提供回退语言环境
- 在真实翻译到来之前使用伪本地化进行测试
