# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The current sub-phase prioritizes test coverage. This task is to begin adding unit tests for core helper functions.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (if Vitest setup for mocks is needed, but prefer in-test mocks)

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
- Add new test files under `src/__tests__/`.
- Ensure Firebase SDK calls are properly mocked using `vitest`.
- Focus on testing the logic *within* the `firestore.ts` helper functions, not the Firebase SDK itself.

## Worker prompt

Your task is to add unit tests for the Firestore helper functions.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Inside `firestore.test.ts`, use `vi.mock` to mock the Firebase Firestore SDK functions that are called by `src/lib/firestore.ts`. This includes functions like `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, and `deleteDoc`. Ensure the mocks return predictable data or throw controlled errors.
3.  **Test `getNailItems`:** Write at least one unit test for the `getNailItems` function in `src/lib/firestore.ts`.
    *   Test that it correctly calls the mocked Firestore methods.
    *   Test that it transforms and returns data as expected from the mocked responses.
    *   Consider a test case for when no items are returned.
4.  **Test `addNailItem`:** Write at least one unit test for the `addNailItem` function in `src/lib/firestore.ts`.
    *   Test that it correctly calls the mocked Firestore `addDoc` method with the expected data.
    *   Test that it handles a successful addition and returns the expected result (e.g., an ID).
5.  **Run tests:** Ensure all new tests pass by running `npm test`.
6.  **Lint and Build:** Verify the project still builds and passes lint checks: `npm run build && npm run lint`.
