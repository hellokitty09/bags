## 2025-02-18 - SwapPanel Accessibility and Polish
**Learning:** Inactive state buttons can cause minor layout shifts (jitter) when toggling active state borders. Additionally, unlabelled form inputs harm screen reader accessibility.
**Action:** Use `border border-transparent` on inactive button states to reserve space for borders without shifting layout. Always pair form inputs with explicit `<label>` tags using `htmlFor` and a hydration-safe `useId()` hook to ensure screen reader compatibility and allow focus via label clicking.
