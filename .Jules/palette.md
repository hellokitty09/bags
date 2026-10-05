## 2024-05-24 - Layout Shifts on State Change
**Learning:** Adding borders to active states without adding a transparent border to inactive states causes a 1px layout shift that makes the UI feel janky.
**Action:** Always apply `border border-transparent` to inactive states when the active state uses a border.
