---
title: "Web Performance: Beyond Core Web Vitals"
description: "Core Web Vitals are just the start. Learn advanced performance techniques including resource hints, code splitting, and the new INP metric."
date: "2024-05-02"
author: "Amara Osei"
tags: ["performance", "seo", "web-development"]
slug: "web-performance-core-vitals"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
readingTime: 11
---

## The Performance Hierarchy

Fast websites aren't just better for users — they rank higher, convert more, and cost less to run. Google's Core Web Vitals are the minimum bar. Here's how to go beyond them.

### The Three Pillars

**LCP (Largest Contentful Paint)** — How fast does the main content appear?
- Target: under 2.5 seconds
- Fix: preload hero images, use CDN, optimize server response time

**CLS (Cumulative Layout Shift)** — Does content jump around?
- Target: under 0.1
- Fix: always set explicit dimensions on images and embeds

**INP (Interaction to Next Paint)** — How responsive is the page?
- Target: under 200ms
- Fix: break up long tasks, use `scheduler.yield()`

### Resource Hints

```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" crossorigin>

<!-- Prefetch next page -->
<link rel="prefetch" href="/en/blog/next-post">

<!-- Preconnect to third-party origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
```

### Code Splitting in Next.js

```typescript
import dynamic from "next/dynamic";

// Only load this component when needed
const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});
```

### The `scheduler.yield()` Pattern

```javascript
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    
    // Yield to browser every 50 items
    if (i % 50 === 0) {
      await scheduler.yield();
    }
  }
}
```

## Measurement Tools

- **Lighthouse**: automated audits in Chrome DevTools
- **WebPageTest**: real-world testing from multiple locations
- **Chrome UX Report**: field data from real users

Performance is a feature. Ship it like one.
