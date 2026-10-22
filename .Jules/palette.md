## 2024-10-22 - Form Accessibility and Layout Shift Improvements

**Learning:** When making toggle buttons or tabs interactive, they often suffer from layout shifts when active states are applied, causing UI jitter. Moreover, custom form inputs often miss proper `<label>` associations when visual labeling is custom, breaking screen reader experience.

**Action:** Consistently use `border border-transparent` in inactive states for Tailwind-styled toggle buttons to prevent layout shift. Always use `useId()` and associate `<label htmlFor={id}>` with `<input id={id}>` when explicit pairing is necessary. Finally, always add `aria-pressed={boolean}` for stateful toggle buttons so their pressed state is announced to screen readers.
