## 2024-10-25 - Icon-only buttons lacking ARIA labels
**Learning:** Found multiple instances of icon-only buttons (like '✕' or '🚀') lacking proper `aria-label`s, breaking accessibility for screen reader users.
**Action:** When working on new UI or components, explicitly check for textless/icon-only buttons and ensure they have descriptive `aria-label` attributes.
