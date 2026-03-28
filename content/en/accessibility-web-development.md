---
title: "Accessibility in Web Development"
description: "Build websites that work for everyone. A practical guide to WCAG compliance, semantic HTML, ARIA, keyboard navigation, and screen reader testing."
date: "2024-06-01"
author: "Elena Marchetti"
tags: ["accessibility", "web-development", "design"]
slug: "accessibility-web-development"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80"
readingTime: 9
---

## Accessibility Is Not Optional

Over 1 billion people worldwide have some form of disability. Inaccessible websites exclude them — and in many jurisdictions, that's also a legal liability. More importantly, it's just the right thing to do.

### Semantic HTML First

The most powerful accessibility tool is already built into HTML:

```html
<!-- Bad -->
<div class="button" onclick="submit()">Submit</div>

<!-- Good -->
<button type="submit">Submit</button>
```

Semantic elements communicate meaning to assistive technologies automatically.

### ARIA When Needed

ARIA (Accessible Rich Internet Applications) fills gaps where HTML semantics fall short:

```html
<!-- Loading state -->
<button aria-busy="true" aria-label="Saving...">
  <span aria-hidden="true">⟳</span>
</button>

<!-- Expandable section -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul id="menu" hidden>...</ul>

<!-- Live region for dynamic content -->
<div aria-live="polite" aria-atomic="true">
  3 results found
</div>
```

### Keyboard Navigation

Every interactive element must be reachable and operable via keyboard:

```css
/* Never remove focus outlines — style them instead */
:focus-visible {
  outline: 2px solid #f54300;
  outline-offset: 2px;
}
```

### Color Contrast

WCAG AA requires:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio
- UI components: 3:1 against adjacent colors

### Testing Checklist

- Tab through the entire page — can you reach everything?
- Turn on a screen reader (NVDA, VoiceOver) and navigate
- Zoom to 200% — does the layout break?
- Test with keyboard only — no mouse

Accessibility improvements benefit everyone: better keyboard shortcuts, clearer labels, faster load times. Build it in from the start.
