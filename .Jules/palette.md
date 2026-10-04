## 2024-10-24 - Missing Form Labels Pattern
**Learning:** Found a recurring accessibility pattern where inline terminal inputs (`TokenSwitcher`) lack explicit `aria-label`s or associated `<label>`s, making them difficult for screen readers to interpret given the app's minimal "terminal" aesthetic.
**Action:** Always ensure inputs have an `aria-label` or an explicitly linked `<label>` (using `useId()`), especially when visual labels are omitted or replaced by placeholders to maintain the theme.
