# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task directly addresses Phase 2.1: Test coverage, by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing, but prefer not to modify core logic)
- `src/__tests__/` (create new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration for mocking Firebase SDK is required, but prefer existing setup if possible)

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
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions used by `src/lib/firestore.ts` (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`) using `vitest`'s `vi.mock()`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
- Ensure tests cover successful operations and basic error handling scenarios where applicable.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest mocking:** In `src/__tests__/firestore.test.ts`, use `vi.mock('firebase/firestore', () => { ... })` to mock the necessary Firebase Firestore SDK functions (`getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`, etc.). The mocks should simulate successful operations and allow for testing different outcomes.
3.  **Write tests for `addNailItem`:**
    *   Test that `addNailItem` correctly calls `addDoc` with the expected collection reference and data.
    *   Ensure it returns the expected data (e.g., the ID of the added document).
4.  **Write tests for `getNailItems`:**
    *   Test that `getNailItems` correctly calls `getDocs` on the specified collection.
    *   Ensure it correctly processes the snapshot and returns an array of nail items with their IDs.
    *   Consider a test case for when no items are found.
5.  **Run tests:** Execute `npm test` and ensure all new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to verify code quality and build integrity.

Focus on mocking Firebase accurately to isolate the logic within `src/lib/firestore.ts` for testing. Remember to keep the diff small.
