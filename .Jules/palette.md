## 2024-10-28 - Dynamic Form Label Associations
**Learning:** Hardcoded IDs in reusable components like TokenSwitcher can cause ID collisions, breaking screen reader association.
**Action:** Always use React's useId() hook to dynamically generate unique IDs when associating a <label htmlFor={id}> with an input/select field in reusable UI components.
