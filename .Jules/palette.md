## 2024-05-18 - Accessible Forms & Icon Buttons
**Learning:** Using `useId()` in React to explicitly associate labels with inputs using `htmlFor` and `id` ensures screen readers can read form fields properly even when dynamically added, and `sr-only` is a great fallback. Icon-only buttons should consistently get `aria-label`s.
**Action:** Always generate explicit `id`s for forms using `useId()` and add `sr-only` labels when visual labels are not desired. Apply `aria-label` to buttons without visual text.
