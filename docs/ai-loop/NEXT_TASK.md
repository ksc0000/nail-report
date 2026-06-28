# Worker Prompt Template

## Context

The product is in Phase 2, focusing on improving stability, test coverage, and UX. This task directly addresses the "Test coverage" objective.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on the `addNailItem` and `getNailItems` functions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but prefer not to alter core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if minor Vitest configuration is needed, e.g., for mock setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any other files not explicitly mentioned in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (Firestore and Auth) as needed for isolated testing.
- Write unit tests for at least `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
- Ensure tests cover successful execution paths for these functions.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to add unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use Vitest's `vi.mock` to mock Firebase Firestore and Firebase Auth, as these are external dependencies that should not be called during unit tests. You might need to mock `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `query`, etc., depending on the implementation of `addNailItem` and `getNailItems`.
3.  **Implement `addNailItem` tests:** Write a test case that verifies `addNailItem` correctly calls the mocked Firestore functions to add a new nail item.
4.  **Implement `getNailItems` tests:** Write a test case that verifies `getNailItems` correctly calls the mocked Firestore functions to retrieve a list of nail items and processes the snapshot as expected.
5.  **Run tests:** Execute `npm test` to ensure your new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure no linting errors or build issues are introduced.

Focus on testing the core logic of these functions in isolation from actual Firebase calls.
Remember to keep the PR small, targeting only these two functions first. If `firestore.ts` requires minor refactoring to make functions more testable (e.g., exporting internal helper functions), you may do so, but minimize changes to existing logic.
