# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage aspect by adding unit tests for core utility functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter production code solely for testing)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts` or similar)
- `vitest.config.ts` (minimal configuration for running tests, if necessary and not already set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, assume Vitest is already configured or can be minimally configured via `vitest.config.ts` without new `npm install` for *new* packages)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing the public helper functions exported from `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies as needed using `vitest` and `vi.mock`.
- Ensure tests cover basic CRUD operations or data retrieval logic within `firestore.ts`.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock `firebase/firestore` functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Focus on mocking at the module level or per test as appropriate to isolate the logic in `firestore.ts`.
3.  **Write Tests**:
    *   Identify the key helper functions exported from `src/lib/firestore.ts`.
    *   Write at least one test case for each significant helper function to verify its interaction with the mocked Firebase SDK. For example, if there's a `getNailItems` function, test that it correctly calls `getDocs` on the mocked collection. If there's an `addNailItem` function, test that it calls `addDoc` with the correct arguments.
4.  **Verify Test Execution**: Run tests using `npm test` or `vitest`.
5.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass without errors.
