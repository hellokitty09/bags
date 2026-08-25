## 2024-11-20 - [TokenSwitcher Accessibility]
**Learning:** Inputs, selects, and icon-only buttons like the cancel button in `TokenSwitcher` often lack screen reader support due to missing explicit linking and `aria-label`s.
**Action:** Always use `useId()` to securely link `label`s and inputs across reusable components, and apply `aria-label` to visually unlabeled or icon-only interactive elements.
