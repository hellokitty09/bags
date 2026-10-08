## 2024-10-08 - Explicit Label Association & ARIA Attributes in TokenSwitcher
**Learning:** The select element in TokenSwitcher had a label but was not explicitly associated with it, which can cause accessibility issues for screen readers. The cancel button was also missing an ARIA label and focus styling.
**Action:** Used React's `useId()` to dynamically link `<label>` and `<select>`, and added ARIA attributes to icon-only buttons and unlabeled inputs.
