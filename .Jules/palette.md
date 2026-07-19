## 2025-02-18 - [TokenSwitcher Accessibility]
**Learning:** Reusable components like `TokenSwitcher` need robust ID generation for forms (e.g., using `useId()`) to associate labels properly and prevent ID collisions when the component is rendered multiple times.
**Action:** Use React's `useId()` hook when explicitly associating form `<label>`s with inputs dynamically, and consistently add `aria-label` attributes to inputs lacking textual descriptions and to icon-only buttons like `✕` to improve screen reader experience.
