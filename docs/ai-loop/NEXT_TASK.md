# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that the first substantive task for Phase 2 is pending. A key priority in Phase 2 is increasing test coverage. The `src/lib/firestore.ts` file contains critical helper functions for interacting with Firebase Firestore.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minor configuration for mocking Firebase SDK if necessary)
- `package.json` (to add `vitest` scripts if not already present, but *no new npm dependencies*)

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
- Use Vitest for testing.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock()` as needed to isolate tests.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`). Focus on testing the interaction with Firestore methods (e.g., `addDoc`, `getDocs`, `doc`, `collection`, `query`).
- Ensure tests cover successful operations and basic error handling where appropriate (e.g., promises rejecting).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Jules, your task is to implement unit tests for the `src/lib/firestore.ts` helper functions using Vitest.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest**: If Vitest is not already configured or if new mock settings are needed, make minimal changes to `vitest.config.ts`.
3.  **Mock Firebase SDK**: Use `vi.mock('firebase/firestore')` to mock the necessary Firestore functions (`collection`, `doc`, `addDoc`, `getDocs`, `deleteDoc`, `updateDoc`, `query`, etc.) and ensure tests are isolated from actual Firebase calls.
4.  **Write Tests**:
    *   Identify at least two key helper functions in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
    *   For each selected function, write unit tests that verify:
        *   The function correctly calls the mocked Firestore methods with the expected arguments.
        *   The function handles successful responses from Firestore.
        *   The function handles potential errors (e.g., a promise rejection from a mocked Firestore call).
    *   Ensure the tests use `expect` assertions to validate the behavior and return values.
5.  **Run tests**: Execute `npm run test` (or `vitest`).
6.  **Run checks**: Ensure `npm run build && npm run lint` pass without errors.

The goal is to provide foundational test coverage for the core Firestore interactions, demonstrating the ability to test Firebase-dependent logic in isolation.
