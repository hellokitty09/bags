## 2024-11-20 - Missing Focus States in Terminal Theme
**Learning:** The custom terminal design system lacked explicit keyboard focus states (`focus-visible`) globally, relying solely on hover states, making components like the `SwapPanel` difficult to use for keyboard-only users.
**Action:** Establish a reusable focus pattern using `focus-visible:ring-1 focus-visible:ring-term-cyan/50` for buttons and `focus-within:border-term-cyan/50 focus-within:ring-1 focus-within:ring-term-cyan/50` for complex input groups to maintain the retro aesthetic while ensuring WCAG compliance.
