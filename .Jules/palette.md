## 2024-05-18 - [TokenSwitcher Accessibility]
**Learning:** In reusable Next.js/React components, using `useId()` is effective for mapping explicit `<label>`s to inputs while preventing ID collisions. Adding `sr-only` labels is ideal for inputs where visual text is undesirable but accessibility is required.
**Action:** Apply `useId()` for `htmlFor` and `id` linking in custom components and utilize `sr-only` class to improve accessibility in compact layouts.
