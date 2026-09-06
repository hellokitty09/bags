## 2024-05-17 - [Accessible Search Inputs with useId]
**Learning:** Components like `AuraCheckInput.tsx` lacked accessible labels. Using `useId()` with an `sr-only` label correctly creates unique accessible name associations without conflicting across multiple instances of the component.
**Action:** Apply an `sr-only` label to stand-alone search or mint input components using `useId()` when visual real estate limits the use of visible labels.
