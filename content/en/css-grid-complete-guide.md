---
title: "CSS Grid: The Complete Guide"
description: "Master CSS Grid from first principles. Learn grid-template-areas, auto-placement, subgrid, and real-world layout patterns every developer needs."
date: "2024-04-18"
author: "Elena Marchetti"
tags: ["css", "web-development", "design"]
slug: "css-grid-complete-guide"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&q=80"
readingTime: 10
---

## Grid vs Flexbox

Flexbox is one-dimensional — it handles rows OR columns. Grid is two-dimensional — it handles rows AND columns simultaneously. Use both; they complement each other.

### Defining a Grid

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 1.5rem;
}
```

### Named Areas

The most readable way to define complex layouts:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

### Auto-Placement

```css
/* Cards that automatically fill available space */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

### Spanning Items

```css
.featured {
  grid-column: span 2;
  grid-row: span 2;
}
```

## Practical Patterns

- **Holy Grail Layout**: header, footer, sidebar, main — all in ~10 lines of CSS
- **Masonry-like**: `grid-template-rows: masonry` (coming to browsers)
- **Overlapping elements**: place items in the same grid cell intentionally

CSS Grid eliminates the need for most layout hacks. If you're still using floats or complex flexbox nesting for page layout, it's time to switch.
