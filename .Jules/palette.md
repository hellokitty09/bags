## 2024-10-24 - Dynamic Label Association with useId
**Learning:** When adding labels to components that may be rendered multiple times, hardcoded IDs cause accessibility violations by associating multiple labels with multiple inputs incorrectly.
**Action:** Always use React's `useId()` hook to generate unique, deterministic IDs for `htmlFor` and `id` attributes to ensure proper accessibility for screen readers in reusable components.
