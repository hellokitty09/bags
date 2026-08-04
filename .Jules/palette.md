## 2024-03-24 - Explicit Form Labels and React `useId()`

**Learning:** When explicitly linking form `<label>` elements to inputs using `htmlFor` and `id`, using a hardcoded string `id` can cause clashes if the component is reused multiple times on the same page. Using React's built-in `useId()` hook guarantees unique IDs for accessible form label association across component instances.

**Action:** Whenever creating a reusable React component with an explicitly linked label and input, import `useId` from `react` and generate a unique ID (`const inputId = useId();`) for the `id` and `htmlFor` attributes instead of hardcoding a string ID.
