## 2026-09-11 - Accessible Form Controls with useId()
**Learning:** When assigning `id` attributes to explicitly relate labels to inputs within reusable React components like `TokenSwitcher`, using static strings can lead to duplicates on the page if the component is mounted multiple times, breaking screen reader associations.
**Action:** Use React's `useId()` hook to generate globally unique IDs per render instance to ensure form `<label htmlFor={...}>` fields strictly correlate with one unique `<input id={...}>`.
