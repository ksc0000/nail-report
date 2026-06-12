# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. The first priority in Phase 2.1 is to add unit tests, starting with helper functions. `src/lib/firestore.ts` contains critical data access logic that requires robust testing.

## Objective

Add Vitest and write unit tests for the `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`. Focus on mocking Firebase SDK calls (e.g., `doc`, `collection`, `addDoc`, `getDocs`) to test the logic of these helper functions in isolation.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (to add Vitest as a dev dependency and a test script, if not already present)
-   `vite.config.ts` (to configure Vitest, if needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Add Vitest as a dev dependency and a test script in `package.json` if not already set up.
-   Create `src/__tests__/firestore.test.ts` for the unit tests.
-   Write tests for `addNailItem` and `getNailItems` from `src/lib/firestore.ts`.
-   Mock Firebase SDK functions like `collection`, `doc`, `addDoc`, `getDocs` using `vi.mock` or similar Vitest features to ensure tests are isolated and fast.
-   Ensure tests cover successful execution and basic error handling scenarios for these functions.
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` (or the equivalent Vitest command) to ensure tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
