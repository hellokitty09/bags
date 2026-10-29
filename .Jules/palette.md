## 2024-10-29 - TokenSwitcher Accessibility Improvements
**Learning:** Dynamic components with conditionally rendered inputs and buttons often lack explicit ARIA labels, semantic `<label>` associations, and clear focus states, making them challenging to navigate via screen readers and keyboards.
**Action:** Consistently use `useId()` for dynamically linking `<label>` elements to `<input>`s, apply `sr-only` labels where visual labels aren't desired, and explicitly style `focus-visible` states on interactive icon buttons.
