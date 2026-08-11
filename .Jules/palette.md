## 2024-08-11 - [Enhance TokenSwitcher loading state with matching spinner]
**Learning:** This app requires explicitly providing feedback to async actions via a spinner within the submit button, instead of replacing it or rendering it somewhere else. We successfully applied this to TokenSwitcher.
**Action:** When adding async action handling, update buttons to include the `<span className="flex items-center gap-2"><span className="w-3 h-3 border border-[theme_color]/40 border-t-[theme_color] rounded-full animate-spin" /> linking…</span>` pattern.
