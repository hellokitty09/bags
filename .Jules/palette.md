
## 2024-08-17 - React useId for A11y
**Learning:** Hardcoded IDs in reusable React components (like TokenSwitcher) break when the component is rendered multiple times, invalidating label-to-input association. Additionally, inputs that do not have a visual label *must* have an `aria-label` to be accessible. Icon-only buttons (like "✕") also need an `aria-label` for screen readers.
**Action:** Use React's `useId()` hook to dynamically generate unique IDs for tying `<label>`s to `<select>`s or `<input>`s. Always apply `aria-label` to form fields and buttons that lack visible, textual labels.
