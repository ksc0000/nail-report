# Worker Prompt Template

## Context

The current phase is 2.0 (Active), focusing on stability, test coverage, and UX. This task addresses Phase 2.1: Test coverage, specifically by adding unit tests for Firestore helper functions in `src/lib/firestore.ts`.

## Objective

Add Vitest and unit tests for at least two helper functions in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `package.json` (only to add `vitest` script if missing, no new dependencies)
-   `vite.config.ts` (if Vitest configuration is required)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, except potentially `vitest` itself if not present in devDependencies, but prefer using existing setup)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Vitest Setup Verification:** Ensure Vitest is correctly configured and available in the project's `devDependencies` and `package.json` scripts (e.g., `test`). If not, add basic Vitest setup to enable running tests.
2.  **Create Test File:** Create a new test file: `src/__tests__/lib/firestore.test.ts`.
3.  **Implement Tests:**
    *   Write comprehensive unit tests for at least two functions found in `src/lib/firestore.ts`. Good candidates include `getNailItem`, `addNailItem`, `updateNailItem`, or `deleteNailItem`.
    *   **Mock Firebase SDK:** Use `vi.mock('firebase/firestore')` to mock Firestore SDK functions (e.g., `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`) to isolate the testing of your helper functions' logic.
    *   Ensure tests cover both successful execution paths and potential error scenarios (e.g., a Firestore operation failing).
    *   If `src/lib/firestore.ts` functions rely on other helpers (e.g., from `src/lib/auth.ts` to get the current user ID), mock those dependencies as well to keep tests focused.
4.  **Run Tests:** Execute `npm test` or `npm run test` and ensure all newly added tests pass.
5.  **Lint and Build:** Run `npm run build && npm run lint`. Address any linting errors or build warnings.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
