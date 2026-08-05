# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. A key part of this phase is adding unit tests for core helper functions. `src/lib/firestore.ts` contains critical functions for interacting with the Firestore database, and adding tests for these will improve reliability and maintainability.

## Objective

Implement Vitest unit tests for at least two helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if necessary for testability, but focus on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__tests__/` (new test files, generally for helper functions)
- `package.json` (only to ensure Vitest is configured, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (no CSS changes for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least **two** helper functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use `vi.mock` to properly mock Firebase Firestore SDK interactions.
- Ensure tests verify correct function calls to Firestore APIs and handle expected return values or errors.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Set up `vi.mock` for the Firebase Firestore SDK (e.g., `firebase/firestore`) within `firestore.test.ts` to mock `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`, etc. This will allow testing `firestore.ts` functions in isolation without actual database calls.
3.  **Select functions to test**: Choose at least two functions from `src/lib/firestore.ts` to test. Good candidates include `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
4.  **Write unit tests**:
    *   For each selected function, write at least one test case.
    *   Tests should verify that the function correctly calls the mocked Firestore methods with the expected arguments.
    *   Tests should also assert the expected return value or error handling.
    *   For `getNailItems`, consider testing scenarios for empty collections or successful data retrieval.
5.  **Run tests**: Execute `npm test` and ensure all new tests pass.
6.  **Lint and build**: Run `npm run lint` and `npm run build` to ensure no linting errors or build issues are introduced.

Focus on mocking and asserting the interactions with the Firebase SDK, rather than testing the SDK itself.
Aim for clear, focused tests that cover the primary success path for each chosen function.
