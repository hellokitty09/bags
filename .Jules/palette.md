## 2026-08-05 - [AuraCheckInput & TokenSwitcher Accessibility Improvements]
**Learning:** Found some inputs lacking `aria-label` and some labels unassociated with their respective inputs. Icon-only buttons (like the `✕` cancel button) lacked screen-reader labels.
**Action:** Applied `useId` to dynamically link labels and inputs. Add explicitly defined `aria-label`s to unlabelled inputs and icon-only buttons to ensure proper screen reader accessibility. Ensure to remove build artifacts (like `tsconfig.tsbuildinfo` and `next-env.d.ts`) when committing.
