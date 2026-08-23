## 2026-08-23 - [Form Accessibility in Reusable Components]
**Learning:** Hardcoded IDs in form labels and inputs cause clashes when the component is reused multiple times on the same page, breaking explicit associations for screen readers.
**Action:** Use React's `useId()` hook when explicitly associating form `<label>`s with inputs dynamically to prevent ID clashes in reusable components.
