## 2024-05-18 - Missing ARIA Labels on Cancel Buttons
**Learning:** Icon-only cancel buttons ("✕") in form inputs within this repo (e.g., in `TokenSwitcher.tsx`) often rely solely on the `title` attribute, which is insufficient for screen readers.
**Action:** Always ensure icon-only buttons have explicit `aria-label` attributes.
