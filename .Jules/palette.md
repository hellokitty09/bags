## 2026-09-07 - Dynamic Input Accessibility
**Learning:** When adding dynamically rendered form inputs that don't have visual labels, they still need `sr-only` labels to remain accessible to screen readers.
**Action:** Use `useId()` to generate unique IDs and pair them with visually hidden `sr-only` labels for inputs that appear conditionally in the UI.
