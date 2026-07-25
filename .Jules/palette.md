## 2026-07-25 - Component specific Accessibility Pattern
**Learning:** Found some missing aria labels in `apps/web/components/TokenSwitcher.tsx` for inputs and icon-only buttons, as well as a `select` element not properly linked to its `label` using `id` and `htmlFor`.
**Action:** Always check interactive components for missing `aria-label` on icon-only buttons and ensure proper `label` to input mapping using `useId()` in React.
