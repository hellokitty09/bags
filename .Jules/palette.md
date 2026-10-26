## 2024-05-24 - SwapPanel Accessibility and Stability
**Learning:** Missing explicit `<label>` elements cause screen readers to fail announcing inputs, and conditionally adding borders to active states without defining transparent borders for inactive states causes subtle layout shifts.
**Action:** Always link labels to inputs using `useId()` when possible, and define `border-transparent` for inactive states to prevent layout shifts.
