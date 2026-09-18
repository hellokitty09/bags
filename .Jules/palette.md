## 2026-09-18 - Component specific useId usage
**Learning:** When using React's `useId()` inside reusable input or select components (like `TokenSwitcher`), it must be consistently bound to both `id` on the input and `htmlFor` on the label to assure uniqueness across instances while preserving a11y.
**Action:** Use `const id = useId();` and apply it directly as `htmlFor={id}` and `id={id}` on the respective label and input/select elements.
