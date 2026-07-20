## 2024-11-20 - Unlabeled Forms and Icon Buttons
**Learning:** Reusable components like `TokenSwitcher` in this app lacked explicit label associations, and icon-only buttons lacked ARIA labels.
**Action:** Always use `useId` for dynamic form elements and verify icon-only buttons have proper `aria-label`s.
