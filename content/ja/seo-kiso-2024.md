---
title: "現代ウェブアプリのSEO基礎"
description: "すべての開発者が知っておくべきSEOの核心原則：構造化データ、Core Web Vitals、セマンティックHTML、Next.js Metadata API。"
date: "2024-03-10"
author: "Amara Osei"
tags: ["seo", "ウェブ開発", "パフォーマンス"]
slug: "seo-kiso-2024"
locale: "ja"
coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&q=80"
readingTime: 7
---

## SEOはエンジニアリングであり、魔法ではない

検索エンジン最適化は神秘的だという評判があります。実際には、基礎は単純なエンジニアリングの問題です：高速なページ、セマンティックマークアップ、正確なメタデータ、信頼できるコンテンツ。

### Next.js Metadata API

Next.js 14は、静的ページのビルド時と動的ページのリクエスト時に`<head>`タグを生成するファーストクラスの`Metadata` APIを提供します。

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

### JSON-LD構造化データ

構造化データは検索エンジンがコンテンツを理解するのに役立ち、リッチリザルトを解放できます。

### Core Web Vitalsチェックリスト

- **LCP**: `<Image>`と`priority`プロップでヒーロー画像を最適化
- **CLS**: 画像に常に明示的な`width`と`height`を設定
- **INP**: クリティカルパスのJavaScriptを最小化

最初からSEOを最優先事項として扱う開発者は、後から追加する開発者を一貫して上回ります。
