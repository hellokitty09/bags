## 2024-05-20 - [Explicitly Associate Labels and Inputs with useId]
**Learning:** When explicitly associating form `<label>`s with inputs dynamically, using React's `useId()` hook prevents ID clashes in reusable components while maintaining screen reader accessibility.
**Action:** Always use `useId()` for `htmlFor` and `id` attributes when creating reusable input components.
