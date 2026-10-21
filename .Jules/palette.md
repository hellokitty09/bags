
## 2026-10-21 - SwapPanel Input Accessibility
**Learning:** Number inputs in compact token swap components often lack explicit labels, reducing screen reader accessibility. Using an active state derived `aria-label` provides necessary context without cluttering the UI.
**Action:** Add dynamic `aria-label` attributes to unlabeled inputs in financial components based on their active side/mode.
