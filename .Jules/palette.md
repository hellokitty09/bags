## 2024-05-18 - Prevent Layout Shifts in Tailwind Borders
**Learning:** When using conditional borders in Tailwind (e.g. `border border-term-green` vs no border), it causes a 1px layout shift which breaks visual polish.
**Action:** Always apply `border border-transparent` to the inactive states of toggle buttons or dynamic border elements to reserve space and prevent jank during interaction.

## 2024-05-18 - Dynamic Form IDs in React
**Learning:** When associating labels with inputs in reusable components, hardcoded IDs can clash if multiple instances render on the same page.
**Action:** Use React's `useId()` hook to generate unique IDs for `htmlFor` and `id` attributes dynamically.
