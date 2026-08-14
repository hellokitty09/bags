## 2024-05-24 - Screen Reader Compatibility with Dynamic Forms
**Learning:** React's dynamic nature can lead to `<label htmlFor="id">` mismatches if IDs are hardcoded or missing in reusable components, breaking screen reader associations. Additionally, icon-only buttons (like "✕" for cancel) fail WCAG criteria without explicit `aria-label`s.
**Action:** Always employ `useId()` for `<label>` to `<input>`/`<select>` associations within dynamic React components to ensure stable, unique IDs. Always explicitly attach `aria-label` attributes to icon-only interactive elements.
