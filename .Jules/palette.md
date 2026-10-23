## 2023-10-23 - Dynamic Input and Select Accessibility in Compact Views
**Learning:** Dynamic, compact UIs like terminal components often drop visible labels to save space or use hidden interactive states. Simply adding an `aria-label` isn't always enough, especially for native form inputs and selects.
**Action:** Consistently use `useId()` and `<label className="sr-only">` to map inputs, and explicitly map visual text as `<label>` elements to their associated `<select>` or `<input>` fields via `htmlFor` matching the generated `id`.
