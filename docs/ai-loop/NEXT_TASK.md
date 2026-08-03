# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key priority in this phase is to add unit tests, especially for core Firebase helper functions. Vitest is already configured as the test runner.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (for inspection of functions to be tested)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `src/__mocks__/` (if necessary for Firebase SDK mocks, but prefer `vi.mock` directly in test file)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for new test files in `src/__tests__/`

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

Your task is to add comprehensive unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/lib/firestore.test.ts`.
2.  **Identify functions to test:** Analyze `src/lib/firestore.ts` and identify the primary functions responsible for interacting with the `nailItems` and potentially `publicShares` collections (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.).
3.  **Mock Firebase SDK:** Use Vitest's `vi.mock` to mock the necessary Firebase SDK modules (`firebase/firestore`, `firebase/auth`) to ensure tests run in isolation without actual Firebase calls. You will need to mock functions like `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc., and their return values.
4.  **Write Unit Tests:**
    *   For each identified function, write at least one test case for a successful operation.
    *   Where applicable, add test cases for error handling (e.g., what happens if a Firestore operation fails).
    *   Ensure good coverage of the logic within the `firestore.ts` helper functions.
5.  **Verify Tests:** Run `npm test` and ensure all new tests pass.

**Acceptance Criteria:**

*   A new file `src/__tests__/lib/firestore.test.ts` is created.
*   This file contains unit tests for at least the primary CRUD (Create, Read, Update, Delete) functions for `nailItems` in `src/lib/firestore.ts`.
*   Firebase SDK dependencies are properly mocked using `vi.mock`.
*   All tests in `src/__tests__/lib/firestore.test.ts` pass when `npm test` is run.
*   The overall diff remains within the 150-line limit.
*   `npm run build && npm run lint` execute successfully without errors or warnings.
