## 2024-07-21 - [A11y] Form controls missing explicit associations
**Learning:** Found `<label>` elements positioned near form controls (like `<select>`) without `htmlFor` or `id` attributes associating them.
**Action:** When adding or auditing inputs and selects, always ensure explicit pairing using `useId()` from React to keep forms accessible.
