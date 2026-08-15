## 2026-08-15 - Focus States for Icon Buttons
**Learning:** Icon-only utility buttons (like 'Cancel' ✕) inside complex interactive components often lack visible focus states, making keyboard navigation difficult or invisible.
**Action:** Always add `focus-visible:ring-1` (or appropriate ring weight) and `outline-none` along with `aria-label`s when rendering icon-only utility buttons.
