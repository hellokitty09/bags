## 2024-09-16 - Associate labels with input dynamically
**Learning:** React `useId()` should be used when associating `<label>` elements with inputs in reusable components to prevent accessibility ID collisions. When replacing labels for inputs or select elements with screen reader only labels (`sr-only`) or when explicit labels exist but lack HTML association, `htmlFor` and `id` must be tied dynamically.
**Action:** Always import `useId` from react and generate `id={selectId}` for inputs/selects and `htmlFor={selectId}` for labels.
