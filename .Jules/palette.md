## 2024-11-20 - Prevent Layout Shifts on Interactive State Borders & Ensure Explicit Form IDs

**Learning:** When using Tailwind to add focus or active state borders, layout shifts can occur (jitter). In complex UI like trading terminals (e.g. Buy/Sell toggles in `SwapPanel`), this is highly visible. Additionally, explicitly associating forms (`<label>`) with dynamic `useId()` hooks prevents ID clashes across reusable components (e.g. `LaunchPanel` and `SwapPanel`).

**Action:** Gracefully apply `border-transparent` (e.g. `border border-transparent`) to inactive states to prevent the element from resizing when standard borders are applied on interaction. Ensure compact layouts missing visual labels are still accessible by adding a `<label className="sr-only">` specifically linked via React `useId()` hook.
