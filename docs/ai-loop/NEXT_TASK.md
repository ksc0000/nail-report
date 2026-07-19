# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-goal in Phase 2 is to increase test coverage using Vitest. This task specifically targets adding unit tests for Firebase helper functions.

## Objective

Implement Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. The focus should be on mocking Firebase SDK interactions to test the logic within the helper functions themselves.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`, `src/__tests__/setup.ts` if needed for global mocks)
- `vitest.config.ts` (if needed for test setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a test file:** Create a new file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:**
    *   Use `vi.mock('firebase/firestore', () => { ... });` at the top of `src/__tests__/firestore.test.ts` to mock the necessary Firestore functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `orderBy`, `limit`).
    *   Ensure the mocks return predictable data structures or resolve/reject promises as needed for testing. For `getDocs`, mock its `docs` property to return an array of objects that have a `data()` method and an `id` property.
3.  **Implement Unit Tests:**
    *   Write at least two unit test suites for functions in `src/lib/firestore.ts`. Good candidates are `getNailItems` and `addNailItem`.
    *   For `getNailItems`, test that it correctly transforms snapshot data into the expected `NailItem` format and handles an empty collection.
    *   For `addNailItem`, test that it correctly calls the mocked `addDoc` function with the expected data.
    *   Focus on testing the *logic within the helper functions*, not the Firebase SDK itself.
4.  **Run Tests:** Use `npm run test` to execute the new unit tests and ensure they pass.
5.  **Lint and Build:** Run `npm run lint` and `npm run build` to verify no new errors are introduced.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists.
*   The Firebase Firestore SDK is mocked appropriately within `firestore.test.ts`.
*   At least two functions from `src/lib/firestore.ts` have comprehensive unit tests verifying their logic.
*   `npm run test` passes all new tests.
*   The PR diff is ≤ 150 lines.
*   `npm run build` and `npm run lint` pass without errors.
