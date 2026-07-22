## 2024-05-18 - Prevent form label ID clashes in reusable components
**Learning:** Hardcoded IDs in form inputs within reusable components cause ID clashes when the component is rendered multiple times, leading to accessibility issues where labels associate with the wrong inputs or only the first rendered instance.
**Action:** Use React's `useId()` hook to dynamically generate unique IDs for `htmlFor` and `id` associations in reusable components like TokenSwitcher.
