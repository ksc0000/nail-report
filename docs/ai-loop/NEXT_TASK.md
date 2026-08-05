```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state shows that setup tasks are complete, and we are ready for the first substantive feature task. Improving test coverage is a high priority in Phase 2.1.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task is foundational for improving overall code stability and maintainability.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability, if strictly necessary)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `package.json` (only to add `vitest` script if not already present, but `npm test` should already be configured for Vitest)
-   `vite.config.ts` (if Vitest configuration is needed, but typically already set up)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, `vitest` is already assumed to be installed)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` and configuration files directly related to testing (e.g., `vite.config.ts`)

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add comprehensive unit tests for functions in `src/lib/firestore.ts`.
-   Mock the Firebase Firestore SDK using `vi.mock('firebase/firestore')` to ensure tests are isolated and don't interact with a live database.
-   Verify tests pass by running `npm test`.
-   Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Create Test File:** Create a new file `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore:** At the top of `src/__tests__/lib/firestore.test.ts`, import `vi` from `vitest` and add a mock for the `firebase/firestore` module. This mock should simulate the behavior of Firestore functions like `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `onSnapshot`, `doc`, `collection`, etc., so that your tests can control their outcomes without needing a real Firebase connection.
3.  **Implement Unit Tests:**
    *   Write `describe` blocks for logical groupings of functions within `src/lib/firestore.ts`.
    *   For each function (e.g., `getItem`, `createItem`, `updateItem`, `deleteItem`, `listenToItems`), write `it` blocks to test different scenarios:
        *   **Success cases:** Ensure the function correctly calls the mocked Firestore methods and transforms data as expected.
        *   **Error cases:** Test how the function handles errors thrown by the mocked Firestore methods (e.g., ensure it throws or handles the error gracefully).
    *   Use `expect().toHaveBeenCalledWith()` to verify that the correct Firestore methods are called with the expected arguments.
    *   Use `expect().resolves` or `expect().rejects` for async functions.
4.  **Run Tests:** Execute `npm test` to ensure all new tests pass.
5.  **Final Checks:** Run `npm run build && npm run lint`. Address any build errors or linting warnings.

**Acceptance Criteria:**
*   A new test file `src/__tests__/lib/firestore.test.ts` exists.
*   The `firebase/firestore` module is mocked within the test file.
*   All public helper functions in `src/lib/firestore.ts` have corresponding unit tests that cover success and basic error paths.
*   `npm test` passes without errors.
*   `npm run build && npm run lint` pass without errors or warnings.
```
