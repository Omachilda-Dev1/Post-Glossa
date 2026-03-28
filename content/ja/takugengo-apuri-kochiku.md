---
title: "Next.jsで多言語ウェブアプリを構築する"
description: "App Router、next-intl、グローバルSEOのためのhreflangタグを使用したNext.js 14の国際化の実践ガイド。"
date: "2024-02-20"
author: "Soren Lindqvist"
tags: ["nextjs", "i18n", "ウェブ開発", "seo"]
slug: "takugengo-apuri-kochiku"
locale: "ja"
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
readingTime: 8
---

## なぜi18nを最初から重要視するのか

国際化は開発者が永遠に先延ばしにする機能の一つです — 製品がライブになり、リファクタリングコストが膨大になるまで。最初からアーキテクチャにi18nを組み込むことは、後から追加するよりはるかに安価です。

### URLの構造はSEOにとって重要

Googleは`example.com/en/blog`と`example.com/ja/blog`を別々のページとして扱います。これは、インデックス可能なコンテンツが2倍になり、複数の言語市場で同時にランクインできることを意味します。

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fr", "de", "es", "pt", "ja", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

### next-intlのセットアップ

`next-intl`ライブラリはApp Routerとシームレスに統合されます。メッセージはJSONファイルに格納され、`useTranslations`フックで型安全なアクセスが可能です。

```typescript
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("hero_title")}</h1>;
}
```

## 重要な考慮事項

- 翻訳キーをフラットで説明的に保つ
- 複数形と補間にICUメッセージ形式を使用する
- 常にフォールバックロケールを提供する
- 実際の翻訳が届く前に疑似ローカライゼーションでテストする
