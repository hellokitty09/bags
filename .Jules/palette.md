## 2023-10-24 - Accessibility improvements for input labels
**Learning:** In reusable components like TokenSwitcher that may be rendered multiple times or have IDs that conflict with other components, using a hardcoded string for the `id` or `htmlFor` attributes can break accessibility for screen readers if the IDs are not strictly unique per page.
**Action:** Use React's `useId` hook to automatically generate unique, stable IDs for explicit label-to-input association.
