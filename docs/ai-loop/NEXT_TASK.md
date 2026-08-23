# Worker Prompt Template

## Context

The `nail-report` application is moving into Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by addressing a core set of helper functions interacting with Firestore. The goal is to ensure the reliability of these critical data operations.

## Objective

Implement unit tests for the core Firestore helper functions (`getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`) located in `src/lib/firestore.ts`. The tests should utilize Vitest and include mocking of the Firebase SDK to isolate the logic under test.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications to export functions for testing if necessary)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (minimal configuration changes for Vitest setup, if absolutely required and Vitest isn't fully configured yet)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval; assume Vitest is already installed as a dev dependency)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Your task is to add unit tests for the following functions in `src/lib/firestore.ts`:
1.  `getNailItems`
2.  `addNailItem`
3.  `updateNailItem`
4.  `deleteNailItem`

**Steps:**

1.  **Ensure Vitest Setup:** Verify that Vitest is configured and runnable. If `vite.config.ts` requires minimal additions to enable Vitest, you may make those changes, but keep them focused solely on Vitest configuration.
2.  **Create Test File:** Create a new test file `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK:** Use `vi.mock` from Vitest to mock Firebase Firestore SDK interactions (e.g., `doc`, `collection`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the necessary Firestore functions to test the helper functions without actually connecting to Firebase.
4.  **Write Tests:** For each of the specified functions (`getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`):
    *   Write a test suite that covers its basic functionality.
    *   Assert that the function behaves as expected (e.g., returns correct data, calls the correct mocked Firestore methods with the right arguments).
    *   Consider error handling for these functions if explicitly implemented within them (e.g., if a Firestore operation fails).
5.  **Refactor (if necessary):** If functions in `src/lib/firestore.ts` are not easily testable due to internal dependencies or lack of exports, make minimal, clean refactorings to make them testable (e.g., exporting previously unexported functions).
6.  **Run Tests:** Execute the newly created tests using Vitest.
7.  **Lint and Build:** Ensure the project still builds and passes lint checks.

**Acceptance Criteria:**

-   A new file `src/__tests__/firestore.test.ts` is created.
-   Unit tests are present for `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
-   Firebase Firestore SDK is appropriately mocked in the tests.
-   Tests pass successfully when `npm test` is run.
-   The changes adhere to the line diff limit (≤ 150 lines).
-   `npm run build` and `npm run lint` complete without errors.
