1. **Fix Layout Shift & Add Accessibility in `SwapPanel.tsx`**
   - In `apps/web/components/terminal/SwapPanel.tsx`, add `border border-transparent` to the inactive state of the Buy/Sell toggle buttons to prevent layout shifting when switching sides.
   - Add an `aria-label` to the number input to make it screen reader accessible.
2. **Add Accessibility in `TokenSwitcher.tsx`**
   - Add `aria-label="Cancel"` to the cancel button for token linking in `apps/web/components/TokenSwitcher.tsx` since it currently only uses an icon (`✕`) and a `title`.
3. **Frontend Verification**
   - Write a Playwright script `verify_ux.py` that starts the dev server.
   - Using the dummy Privy ID and other environment variables to bypass auth, the script will open the terminal (`/terminal?demo=true`), click the token switcher, fill the token input, add a token, and then interact with the `SwapPanel` to visually verify the layout shift fix and that the elements are correctly updated.
   - Take a screenshot of the SwapPanel to verify.
   - Read the screenshot file explicitly to verify visually.
4. **Update Journal**
   - Add an entry to `.Jules/palette.md` noting the layout shift prevention technique for Tailwind active state borders and the importance of screen reader labels for dynamically updated inputs.
5. **Run Tests & Typechecks**
   - Execute `cd apps/web && pnpm typecheck && pnpm test` to ensure no regressions were introduced.
6. **Pre-Commit Steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
7. **Submit Changes**
   - Submit the PR with the title "🎨 Palette: [UX improvement]" and the specified description format.
