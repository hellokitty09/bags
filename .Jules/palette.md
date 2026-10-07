## 2024-10-07 - [Dummy ID Playwright Local Routing]
**Learning:** Playwright navigation on NextJS apps using dummy Privy IDs throws unhandled 'Invalid Privy app ID' exceptions when navigating to unauthenticated root paths or during initial app compilations.
**Action:** When validating frontend pages without proper API backend contexts, navigate directly to deep routes (e.g., `http://localhost:3000/terminal?demo=true`), bypass Privy logic through custom API mocks (e.g. `page.route`), and ensure to append `?demo=true` or programmatically add `demo_mode=true` cookies to bypass global session hooks.

## 2024-10-07 - [Playwright Specificity and Groundedness]
**Learning:** When generating Playwright test verifications, guessing textual element states (e.g. `wait_for_selector('text=Flex your aura')`) can cause timeouts if the specific text is dependent on conditional rendering or missing mock data.
**Action:** Verify element locators stringently against source code within the current trace. Target robust selectors (e.g. explicit `[placeholder="..."]` or fundamental textual elements like `'text=YOU PAY'`) known to exist regardless of API load states.
