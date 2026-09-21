## 2026-09-21 - Dynamic IDs for Form Fields in Reusable Components
**Learning:** Hardcoded IDs in form fields (e.g., `id="mint-input"`) cause accessibility issues and HTML validation errors when components like `TokenSwitcher` are rendered multiple times or exist alongside other forms.
**Action:** Use React's `useId()` hook to generate unique, stable IDs for associating `<label>` elements with their respective `<input>` or `<select>` fields via the `htmlFor` attribute. For visually hidden labels, use an `sr-only` class while maintaining the explicit ID linkage.
