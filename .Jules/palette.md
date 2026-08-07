## 2023-10-27 - [TokenSwitcher Accessibility Update]
**Learning:** React component `<label>`s inside reusable components need dynamic IDs to avoid duplicate ID issues across the DOM.
**Action:** Always use React's `useId()` when explicitly binding `<label htmlFor="...">` to inputs/selects inside mapped or repeatedly rendered components to ensure unique accessibility trees.
