## $(date +%Y-%m-%d) - Token Switcher Accessibility
**Learning:** Using React's `useId()` hook is an effective way to dynamically associate form labels to inputs in reusable components to prevent ID clashes, improving screen reader accessibility. Also ensuring icon-only buttons have an `aria-label`.
**Action:** Always use `useId()` when explicitly associating form `<label>`s with inputs in components that might be rendered multiple times, and add `aria-label` to icon-only buttons.
