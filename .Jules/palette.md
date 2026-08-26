## 2026-08-26 - Adding accessibility to dynamic input forms
**Learning:** Reusable components like inputs or buttons lack semantic connections when dynamically instantiated or when their visual design doesn't accommodate a persistent visible text label. Missing ARIA labels or non-unique ids break screen reader and keyboard accessibility.
**Action:** Use React's `useId` hook to dynamically connect labels to their respective form controls to ensure id uniqueness and consistently use `aria-label` for fields and icon buttons where a text label is missing or hidden.
