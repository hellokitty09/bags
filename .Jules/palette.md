## 2024-05-19 - Explicitly associating dynamic form labels
**Learning:** In reusable components like TokenSwitcher that are rendered multiple times, hardcoded IDs for form fields can lead to accessibility bugs since screen readers will have trouble matching labels to inputs properly.
**Action:** Use React's `useId()` hook to generate unique IDs on the fly and use them to explicitly associate form `<label>`s with their inputs (`htmlFor` and `id` props) to prevent ID clashes in reusable components.
