## 2024-05-14 - Accessible dynamic form labels and inputs
**Learning:** React's `useId()` is crucial for explicit `<label>` and `<input>`/`<select>` associations in reusable components to prevent ID collisions. Additionally, text inputs without visible labels and icon-only buttons need `aria-label`s for screen reader compatibility.
**Action:** Always use `useId()` for `htmlFor` and `id` when creating form inputs, and provide an `aria-label` for inputs without a visible label and buttons that contain only icons.
