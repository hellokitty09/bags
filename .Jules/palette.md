## 2024-09-04 - Initial Setup
**Learning:** Understanding the codebase structure.
**Action:** Found multiple components with missing accessibility features, like tooltips, aria-labels, and interactive focus states. Will implement one of these improvements.
## 2024-09-04 - ARIA and focus association
**Learning:** React's `useId()` hook is invaluable for explicitly associating form `<label>`s with inputs in reusable components, preventing ID clashes across multiple instances on the same page. Adding `sr-only` classes to labels maintains screen reader accessibility in compact UIs without breaking the visual layout.
**Action:** Always verify that input elements have an associated label (visual or `sr-only`) and that interactive elements have descriptive `aria-labels` when their visual representation relies solely on icons.
