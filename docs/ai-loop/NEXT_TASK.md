# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that Vitest is the chosen test runner and the goal is to add unit tests for `src/lib/firestore.ts` helper functions. This task is the first substantive task for the AI Loop.

## Objective

Implement Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, specifically focusing on `addNailItem` and `getNailItems`. This involves setting up mocks for the Firebase Firestore SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability, if necessary)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`
-   Any files outside `src/lib/firestore.ts` or `src/__tests__/` for this task.

## Requirements

-   Keep diff ≤ 150 lines.
-   Create `src/__tests__/firestore.test.ts`.
-   Use `vitest` for testing.
-   Mock `firebase/firestore` SDK functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`) as needed.
-   Write at least two unit tests covering the `addNailItem` and `getNailItems` functions from `src/lib/firestore.ts`.
-   Ensure tests are isolated and do not interact with actual Firebase services.
-   Run `npm run build && npm run lint` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to add unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`. Follow these steps:

1.  **Create a new test file**: In `src/__tests__/`, create a file named `firestore.test.ts`.
2.  **Import and Mock Firebase Firestore**:
    *   Inside `firestore.test.ts`, import `vitest` utilities (`describe`, `it`, `expect`, `vi`).
    *   Mock the `firebase/firestore` module using `vi.mock`. You will need to mock functions like `collection`, `doc`, `addDoc`, `getDocs` as they are used by `addNailItem` and `getNailItems`. Provide mock implementations that return expected data or resolved promises.
3.  **Import `firestore.ts` helpers**: Import `addNailItem` and `getNailItems` from `src/lib/firestore.ts`.
4.  **Write Tests for `addNailItem`**:
    *   Create a test suite (`describe`) for `addNailItem`.
    *   Write a test case (`it`) to verify that `addNailItem` calls `addDoc` with the correct arguments and returns the expected result (e.g., the ID of the new item).
    *   Ensure the mocks capture the calls correctly.
5.  **Write Tests for `getNailItems`**:
    *   Create a test suite (`describe`) for `getNailItems`.
    *   Write a test case (`it`) to verify that `getNailItems` calls `getDocs` and correctly processes the snapshot data, returning an array of nail items.
    *   The `getDocs` mock should return a simulated `QuerySnapshot` with mock `QueryDocumentSnapshot` objects.
6.  **Run Tests**: Execute `npm run test` to confirm the new tests pass.
7.  **Lint and Build**: Run `npm run lint` and `npm run build` to ensure no new errors are introduced.

Report any challenges encountered with Firebase mocking or test setup.

**Acceptance Criteria:**
*   A new file `src/__tests__/firestore.test.ts` exists.
*   `firestore.test.ts` contains `vi.mock` for `firebase/firestore`.
*   At least one passing unit test for `addNailItem`.
*   At least one passing unit test for `getNailItems`.
*   All tests pass when running `npm run test`.
*   `npm run build` and `npm run lint` execute successfully without errors or warnings.
