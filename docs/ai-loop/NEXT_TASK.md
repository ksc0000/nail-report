# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and user experience. The current state indicates that the first substantive task is pending. This task focuses on establishing foundational unit test coverage for core Firebase interaction helpers.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`. Focus on mocking Firebase SDK interactions to test the logic of the helper functions independently.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors to improve testability)
-   `src/__tests__/firestore.test.ts` (new test file)
-   `vite.config.ts` (if Vitest setup needs minor adjustments for test file discovery, but avoid complex changes)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css` or other CSS files (not relevant to this task)
-   `src/App.tsx` or other UI components (focus on `lib` layer)

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Implement unit tests for at least two core CRUD helper functions related to `nailItems` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) within `src/lib/firestore.ts`.
-   Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `getDocs`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
-   Ensure tests cover successful operations and basic error handling where applicable within the helper functions.
-   The tests should verify that the `firestore.ts` functions correctly interact with the mocked Firebase SDK, demonstrating proper data transformation or call arguments.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Implement unit tests for `src/lib/firestore.ts`.

1.  **Create Test File:** Create a new test file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock('firebase/firestore')` to mock the necessary Firebase Firestore functions. The mock should provide controlled responses to simulate successful and potentially failed operations. For instance, `addDoc` could return a mock `DocumentReference`, `getDocs` could return a mock `QuerySnapshot` with an array of mock `QueryDocumentSnapshot` objects.
3.  **Test `src/lib/firestore.ts` Functions:**
    *   Choose at least two primary `nailItem` CRUD functions from `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
    *   Write test cases for these functions.
    *   For `addNailItem`, test that it correctly calls the mocked `addDoc` with the expected collection path and data.
    *   For `getNailItems`, test that it correctly calls the mocked `getDocs` and transforms the returned mocked `QuerySnapshot` into the expected array of `NailItem` objects.
    *   Ensure each test is self-contained and uses the mocked Firebase SDK.
4.  **Run Tests:** Execute `npm run test` to verify the new tests pass.
5.  **Lint and Build:** Run `npm run lint && npm run build` to ensure code quality and project integrity.

This task specifically aims to initiate the test coverage outlined in Phase 2.1 of the roadmap, focusing on a critical `lib` file.
