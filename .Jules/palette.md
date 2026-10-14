## 2026-10-14 - Accessible Icon Buttons & Dynamic Labels
**Learning:** Reusable components like TokenSwitcher need dynamic IDs (via useId) to avoid clashes when rendered multiple times. Icon-only buttons must always have an aria-label and visible focus state for keyboard users.
**Action:** Always verify keyboard accessibility and use sr-only labels for inputs that lack visual labels in compact UI designs.
