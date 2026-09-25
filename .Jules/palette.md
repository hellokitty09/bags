
## 2024-05-18 - Prevent 1px layout shift in active states with borders
**Learning:** Adding a 1px border to an active state (like a selected toggle button) while leaving the inactive state borderless causes a 1px layout shift.
**Action:** Always gracefully apply a transparent border (e.g., `border border-transparent`) to inactive states to reserve the space and prevent jank.
