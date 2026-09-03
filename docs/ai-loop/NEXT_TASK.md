# Worker Prompt Template

## Context

The current phase of the roadmap is 2.0, focusing on improving stability, test coverage, and UX. This task contributes to Phase 2.1, specifically adding unit tests for Firestore helper functions. Vitest is the chosen test runner and mocking Firebase SDK is expected.

## Objective

Implement unit tests for the `getNailItems` and `addNailItem` helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements - not applicable for this task)

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

## Worker prompt

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock the Firebase Firestore SDK calls that `getNailItems` and `addNailItem` rely on. Ensure that mock implementations return predictable data.
3.  **Test `getNailItems`**: Write a unit test for the `getNailItems` function in `src/lib/firestore.ts`. Verify that it correctly fetches and processes a list of nail items from the mocked Firestore.
4.  **Test `addNailItem`**: Write a unit test for the `addNailItem` function in `src/lib/firestore.ts`. Verify that it correctly calls the mocked Firestore to add a new item and handles the returned data (e.g., ID generation).
5.  **Run tests**: Ensure the new tests pass using `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
