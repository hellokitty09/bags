## 2026-07-17 - Dynamic Select ID association
**Learning:** In reusable components like `TokenSwitcher.tsx`, hardcoded IDs for linking labels to inputs can conflict. Using React's `useId()` solves this perfectly while remaining fully accessible.
**Action:** Use `useId()` when linking labels in components that might be rendered multiple times on a page.
