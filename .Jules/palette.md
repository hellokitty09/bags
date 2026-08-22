## 2024-05-18 - [TokenSwitcher Accessibility]
**Learning:** Found several missing ARIA attributes and missing label-input associations in a complex React component. Adding `useId` is a clean way to associate dynamically rendered inputs with labels without risking ID clashes.
**Action:** When working on form inputs or select dropdowns, always ensure they are programmatically associated with their labels using `htmlFor` and `id`, and provide `aria-label`s for inputs that lack visible text labels or icon-only buttons.
