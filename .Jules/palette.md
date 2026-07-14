## 2026-07-14 - Enhance Form Accessibility
**Learning:** Input and Select fields without explicit ARIA labels or associated Labels are a common issue for keyboard accessibility/screen readers in standard terminal style interfaces.
**Action:** Ensure every Select field has a corresponding Label associated with `htmlFor` and `id`, and any bare icon-only buttons or inputs have descriptive `aria-label` attributes.
