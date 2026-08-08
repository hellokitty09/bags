## 2023-10-27 - [TokenSwitcher Accessibility]
**Learning:** Hardcoded IDs on form inputs are a problem when a component could theoretically be instantiated multiple times on the same page. Using `useId()` is required to correctly map labels to inputs without clashing. Also, many interactive elements like "Cancel" or "Close" buttons may just contain a symbol ('✕') which is inaccessible to screen readers unless given a descriptive `aria-label`.
**Action:** Consistently use `useId()` for all dynamically associated labels and ensure icon-only buttons or symbol-only buttons carry an `aria-label`.
