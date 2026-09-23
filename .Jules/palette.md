## 2026-09-23 - Dynamic form labels and ID generation
**Learning:** When associating form labels with inputs in reusable components, static IDs can cause clashes when multiple instances are rendered. Even for hidden labels, a distinct `htmlFor` mapping is required.
**Action:** Use React's `useId()` hook to generate unique IDs for `id` and `htmlFor` pairings within components like `TokenSwitcher`.
