# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses `2.1 Test coverage` by adding unit tests for core Firebase helper functions. The `src/lib/firestore.ts` file contains essential functions for interacting with the Firestore database, and these currently lack dedicated unit tests. Vitest is already set up as the test runner, and mocking Firebase SDK is explicitly mentioned as a strategy.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but primarily for understanding)
- `src/__tests__/firestore.test.ts` (new file)
- `package.json` (only to add `test` script if not present, but no new dependencies)
- `vite.config.ts` (if minor Vitest config is needed for mocks, unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly mentioned in the "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Add tests when touching `src/lib/` files (this task *is* about adding tests).
- Report follow-up items as comments, not additional code.

## Worker Prompt

### Task: Add Vitest unit tests for `src/lib/firestore.ts` helpers

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the necessary Firebase Firestore SDK modules and functions (e.g., `firebase/firestore`, `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the lowest-level Firebase calls so that `src/lib/firestore.ts` functions can be tested in isolation.
3.  **Select functions to test:** Choose at least 2-3 representative CRUD functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `deleteNailItem`).
4.  **Write unit tests:**
    *   For each selected function, write one or more unit tests to verify its behavior.
    *   Ensure tests cover successful operations and potential edge cases or error paths (if easily mockable within the ≤150 line diff limit).
    *   Use `expect` assertions to verify that Firebase functions are called correctly with the expected arguments, and that the `firestore.ts` helper functions return the expected values.
5.  **Run tests:** Execute `npm run test` (or `vitest`) to ensure all new tests pass.
6.  **Verify code quality:** Run `npm run build && npm run lint`.

### Acceptance Criteria

*   A new file `src/__tests__/firestore.test.ts` has been created.
*   The `src/__tests__/firestore.test.ts` file contains unit tests for at least 2-3 functions from `src/lib/firestore.ts`.
*   Firebase Firestore SDK modules/functions are mocked effectively using `vi.mock`.
*   All new unit tests pass successfully when `npm run test` is executed.
*   The project builds and lints without errors: `npm run build && npm run lint`.
