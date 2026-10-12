
## 2024-05-20 - Prevent Layout Shift with Transparent Borders
**Learning:** When using Tailwind borders for active states on elements like buttons, adding `border border-transparent` to the inactive state prevents the element's layout dimensions from shifting when the state changes. In addition, dynamically updated inputs must have accessible `aria-label`s.
**Action:** Always include a `border-transparent` placeholder for inactive states when toggling a border to signify an active state, and consistently use `aria-label` on form inputs without explicit associated visible labels.
