
## 2024-10-26 - Accessible form controls in TokenSwitcher
**Learning:** Reusable components like `TokenSwitcher` require React's `useId()` hook to associate `<label>` and `<select>` elements without risking ID collisions when the component is used multiple times. Icon-only buttons (like a cancel 'X' button) also need explicit `aria-label`s for screen readers.
**Action:** When adding labels to dynamic or reusable components, always use `useId()` to generate unique IDs. Consistently ensure all icon-only interactive elements contain an `aria-label`.
