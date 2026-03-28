---
title: "Database Indexing Explained"
description: "Why your queries are slow and how to fix them. A developer's guide to database indexes — B-trees, composite indexes, covering indexes, and query planning."
date: "2024-07-08"
author: "Amara Osei"
tags: ["database", "performance", "backend", "programming"]
slug: "database-indexing-explained"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80"
readingTime: 10
---

## The Index Analogy

A database without indexes is like a book without a table of contents. To find anything, you read every page. Indexes let the database jump directly to what you need.

### How B-Tree Indexes Work

Most database indexes use a B-tree (balanced tree) structure. Values are stored in sorted order, allowing binary search — O(log n) instead of O(n).

```sql
-- Without index: full table scan (slow)
SELECT * FROM articles WHERE slug = 'my-post';

-- Create index
CREATE INDEX idx_articles_slug ON articles(slug);

-- Now: index lookup (fast)
SELECT * FROM articles WHERE slug = 'my-post';
```

### Composite Indexes

Order matters in composite indexes:

```sql
-- This index helps queries that filter by (locale) or (locale, date)
CREATE INDEX idx_articles_locale_date ON articles(locale, date DESC);

-- ✓ Uses index
SELECT * FROM articles WHERE locale = 'en' ORDER BY date DESC;

-- ✓ Uses index (leftmost prefix)
SELECT * FROM articles WHERE locale = 'en';

-- ✗ Cannot use index (skips locale)
SELECT * FROM articles WHERE date > '2024-01-01';
```

### Covering Indexes

A covering index includes all columns needed by a query — no table lookup required:

```sql
-- Query needs: locale, slug, title, date
CREATE INDEX idx_covering ON articles(locale, date DESC, slug, title);

-- This query is served entirely from the index
SELECT slug, title, date FROM articles
WHERE locale = 'en'
ORDER BY date DESC
LIMIT 10;
```

### When NOT to Index

- Columns with very low cardinality (e.g., boolean flags)
- Tables with heavy write loads (indexes slow down INSERT/UPDATE)
- Small tables (full scan is faster than index lookup)

### EXPLAIN Your Queries

```sql
EXPLAIN ANALYZE
SELECT * FROM articles WHERE locale = 'en' AND tags @> ARRAY['seo'];
```

Look for: `Seq Scan` (bad on large tables), `Index Scan` (good), `Index Only Scan` (best).

Indexes are free performance. Use them wisely.
