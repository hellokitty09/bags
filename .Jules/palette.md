## 2024-04-12 - TokenSwitcher Accessibility
**Learning:** Using `useId()` is necessary for explicitly linking labels to inputs/selects in dynamic, reusable components to avoid ID clashes. Also, icon-only buttons like 'X' for cancel need an explicit `aria-label` and visible focus states (e.g. `focus-visible:ring-1`) for screen readers and keyboard navigation.
**Action:** Apply `useId()` for dynamic form labelling and always ensure icon-only buttons have `aria-label` and a `focus-visible` class ring.
