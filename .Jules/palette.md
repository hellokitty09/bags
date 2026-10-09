## 2024-10-24 - Missing Form Label Associations in Custom Components
**Learning:** Custom input and select components in this app (e.g., TokenSwitcher, SwapPanel) frequently rely on visual adjacent text or placeholders without explicit `<label>` associations (`htmlFor` / `id`), degrading the screen reader experience.
**Action:** Consistently use React's `useId()` to link inputs to visual labels, and apply an `sr-only` label for compact inputs that only have placeholders. Ensure icon-only buttons (like cancel/close) always have descriptive `aria-label`s.
