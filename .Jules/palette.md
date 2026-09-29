## 2026-09-29 - Accessible Transient Inputs with useId
**Learning:** In reusable components like TokenSwitcher with conditionally rendered inputs, explicit IDs can clash if multiple instances exist. Furthermore, input fields need programmatic labels for screen readers even if visual labels aren't suitable for the layout.
**Action:** Use React's `useId()` to generate unique IDs and pair them with an `sr-only` label class to maintain screen reader accessibility without altering compact visual layouts.
