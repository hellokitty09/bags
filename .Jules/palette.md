## 2026-09-09 - Accessible Compact Layouts
**Learning:** In reusable React components with compact layouts where a visible label isn't desired, standard hardcoded IDs can cause collisions. Missing labels cause significant accessibility issues for screen readers.
**Action:** Use React's `useId()` hook combined with an `sr-only` class on the label to explicitly associate inputs dynamically and prevent ID clashes without disrupting the layout.
