## 2024-10-10 - Accessible Form Inputs in Reusable Components
**Learning:** Using `useId()` combined with `sr-only` labels ensures form inputs in reusable components are accessible to screen readers without ID clashes or impacting compact visual layouts.
**Action:** Always generate unique IDs using `useId()` and associate them via `htmlFor` for both visible and screen-reader-only labels in reusable components.
