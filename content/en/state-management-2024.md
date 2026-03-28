---
title: "State Management in 2024: What Actually Works"
description: "Redux is no longer the default answer. Compare Zustand, Jotai, TanStack Query, and React's built-in tools to find the right solution for your app."
date: "2024-07-22"
author: "Soren Lindqvist"
tags: ["react", "web-development", "programming"]
slug: "state-management-2024"
locale: "en"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
readingTime: 9
---

## The State Management Landscape Has Changed

In 2019, the answer to "how do I manage state?" was almost always Redux. In 2024, the answer is "it depends" — and that's a good thing.

### Categorize Your State First

| Type | Examples | Best Tool |
|------|----------|-----------|
| Server state | API data, user profile | TanStack Query |
| UI state | modal open, selected tab | useState / useReducer |
| Global UI state | theme, sidebar | Zustand / Context |
| Form state | input values, validation | React Hook Form |
| URL state | filters, pagination | URL params |

### TanStack Query for Server State

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";

function ArticleList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles", { locale: "en" }],
    queryFn: () => fetchArticles("en"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { mutate: createArticle } = useMutation({
    mutationFn: (data) => api.post("/articles", data),
    onSuccess: () => queryClient.invalidateQueries(["articles"]),
  });
}
```

### Zustand for Global UI State

```typescript
import { create } from "zustand";

interface ThemeStore {
  dark: boolean;
  toggle: () => void;
}

const useTheme = create<ThemeStore>((set) => ({
  dark: false,
  toggle: () => set((state) => ({ dark: !state.dark })),
}));

// In any component
function ThemeButton() {
  const { dark, toggle } = useTheme();
  return <button onClick={toggle}>{dark ? "Light" : "Dark"}</button>;
}
```

### When useState Is Enough

Don't reach for a library when the built-in tools work:

```typescript
// Local UI state — just use useState
const [isOpen, setIsOpen] = useState(false);

// Derived state — just compute it
const filteredPosts = posts.filter(p => p.tags.includes(selectedTag));
```

The best state management is the least state management. Start simple, add complexity only when you feel the pain.
