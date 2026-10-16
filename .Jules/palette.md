## 2026-10-16 - Prevent layout shift & dynamic a11y IDs
**Learning:** When adding borders for active states in Tailwind, applying border-transparent to inactive states prevents layout shift. Also, React's useId() hook is crucial for associating form inputs/labels without ID clashing in reusable components.
**Action:** Use border-transparent for inactive states matching active state border width, and use useId() for label/input association.
