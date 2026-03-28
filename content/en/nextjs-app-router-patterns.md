---
title: "Next.js App Router: Patterns That Actually Work"
description: "Real-world patterns for the Next.js App Router — parallel routes, intercepting routes, loading UI, error boundaries, and streaming with Suspense."
date: "2024-09-10"
author: "Soren Lindqvist"
tags: ["nextjs", "react", "web-development", "performance"]
slug: "nextjs-app-router-patterns"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&q=80"
readingTime: 11
---

## The App Router Mental Model

The App Router isn't just a new file structure — it's a fundamentally different way of thinking about rendering. Every folder is a route segment. Every `page.tsx` is a UI. Every `layout.tsx` wraps its children persistently.

### Loading UI with Suspense

```tsx
// app/[locale]/blog/loading.tsx
export default function Loading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-64" />
      ))}
    </div>
  );
}
```

### Error Boundaries

```tsx
// app/[locale]/blog/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-20">
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Parallel Routes

Show multiple pages simultaneously in the same layout:

```
app/
  @modal/
    (.)blog/[slug]/
      page.tsx    ← intercepted route (modal)
  blog/
    [slug]/
      page.tsx    ← full page
  layout.tsx      ← renders both @modal and children
```

### Streaming with Suspense

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1>Blog</h1>
      {/* This streams in as soon as it's ready */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    </div>
  );
}

async function Posts() {
  const posts = await fetchPosts(); // Can be slow
  return <PostList posts={posts} />;
}
```

### Route Groups

Organize routes without affecting URLs:

```
app/
  (marketing)/
    page.tsx        → /
    about/page.tsx  → /about
  (app)/
    dashboard/      → /dashboard
    settings/       → /settings
```

The App Router rewards understanding its mental model. Once it clicks, building complex applications becomes surprisingly straightforward.
