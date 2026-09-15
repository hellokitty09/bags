## 2024-05-24 - Accessibility improvements on SwapPanel
**Learning:** Adding labels to unstructured spans provides better screen reader context on existing components. When adding a border explicitly for an active ring (focus states), we can prevent layout shifts by implicitly adding a transparent border on the default un-focused state.
**Action:** When creating form inputs without explicitly nested labels, use `useId` and reference the ID manually. Add `border border-transparent` implicitly on un-focused inputs.
