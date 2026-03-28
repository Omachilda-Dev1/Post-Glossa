---
title: "React Server Components Explained"
description: "Everything you need to know about React Server Components — what they are, how they differ from client components, and when to use each."
date: "2024-04-12"
author: "Soren Lindqvist"
tags: ["react", "nextjs", "web-development", "performance"]
slug: "react-server-components-explained"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80"
readingTime: 8
---

## The Mental Model Shift

React Server Components (RSC) represent the biggest architectural change to React since hooks. The core idea: some components run only on the server, others only on the client, and the framework handles the boundary.

### Server vs Client Components

| Feature | Server | Client |
|---------|--------|--------|
| Runs on | Server only | Browser |
| Can use hooks | No | Yes |
| Can access DB | Yes | No |
| Bundle size | Zero | Included |
| Interactivity | No | Yes |

### Default is Server

In Next.js App Router, every component is a Server Component by default:

```tsx
// This runs on the server — no "use client" needed
async function BlogPost({ slug }: { slug: string }) {
  const post = await db.posts.findOne({ slug }); // Direct DB access!
  return <article>{post.content}</article>;
}
```

### Opting Into Client

Add `"use client"` only when you need browser APIs or interactivity:

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### The Composition Pattern

The key insight: Server Components can render Client Components, but not vice versa.

```tsx
// Server Component
async function Page() {
  const data = await fetchData();
  return (
    <div>
      <StaticContent data={data} />  {/* Server */}
      <InteractiveWidget />           {/* Client */}
    </div>
  );
}
```

## When to Use Each

Use Server Components for: data fetching, database queries, large dependencies, static content.

Use Client Components for: event handlers, browser APIs, useState/useEffect, real-time updates.

The result is dramatically smaller JavaScript bundles and faster initial page loads.
