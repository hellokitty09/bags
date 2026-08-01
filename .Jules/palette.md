## 2024-05-18 - Form Accessibility
**Learning:** Reusable form components like `TokenSwitcher` that render multiple times per page need `useId()` for `<label htmlFor={id}>` to work without ID collisions.
**Action:** Always use `useId()` when linking labels to inputs in reusable React components instead of static IDs.
