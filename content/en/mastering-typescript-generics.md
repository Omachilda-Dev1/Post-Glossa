---
title: "Mastering TypeScript Generics"
description: "A deep dive into TypeScript generics — from basic type parameters to advanced conditional types and mapped types that make your code truly reusable."
date: "2024-04-05"
author: "Soren Lindqvist"
tags: ["typescript", "web-development", "programming"]
slug: "mastering-typescript-generics"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&q=80"
readingTime: 9
---

## Why Generics Change Everything

TypeScript without generics is like a library with only one book. Generics let you write functions and classes that work with any type while still maintaining full type safety.

### The Basic Pattern

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);     // type: number
const str = identity<string>("hello"); // type: string
```

### Generic Constraints

Use `extends` to constrain what types are allowed:

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): T {
  console.log(value.length);
  return value;
}

logLength("hello");   // ✓
logLength([1, 2, 3]); // ✓
logLength(42);        // ✗ Error: number has no length
```

### Conditional Types

```typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false
```

### Mapped Types

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};
```

## Practical Patterns

- Use `keyof T` to iterate over object keys safely
- Use `infer` inside conditional types to extract nested types
- Combine generics with utility types like `Partial`, `Required`, `Pick`, `Omit`

Generics are the foundation of every great TypeScript library. Master them and your code becomes infinitely more expressive.
