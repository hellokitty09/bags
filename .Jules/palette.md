## 2024-05-19 - Accessible Form Inputs Without Visual Labels
**Learning:** For compact dashboard layouts (like `TokenSwitcher`, `SwapPanel`, and `LaunchPanel`) where visual `<label>` tags disrupt the design, screen readers often fail to announce the purpose of the `<input>` or `<select>` element.
**Action:** Always provide an explicitly associated visually hidden label (e.g., using `React.useId()` for `id` and `htmlFor` with `sr-only` class) or an `aria-label` directly on the input element for screen reader accessibility when a visual `<label>` is intentionally omitted.
