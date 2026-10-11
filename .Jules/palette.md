## $(date +%Y-%m-%d) - Improve TokenSwitcher Accessibility
**Learning:** Using `useId()` prevents ID collisions when connecting explicitly hidden labels (like `sr-only`) with complex responsive form controls, while `aria-label` provides a great fallback for interactive elements like close buttons and generic dropdowns.
**Action:** Always link visual/hidden labels to inputs using `useId()` to ensure robust screen reader support across all viewports.
