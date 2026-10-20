
## 2024-05-18 - Missing Screen Reader Associations in Custom React Dropdowns
**Learning:** In reusable Next.js 14+ components with dynamic dropdowns/inputs, custom visual styles often lead to implicitly unassociated `<label>` and `<select>`/`<input>` tags. The `sr-only` class is essential for screen readers on input fields where visual layouts dictate no text label.
**Action:** When auditing form elements, explicitly verify `htmlFor` on `<label>` matches the `id` on the input/select, utilizing React's `useId()` hook to avoid collisions. Add `aria-label` tags to purely iconic action buttons.
