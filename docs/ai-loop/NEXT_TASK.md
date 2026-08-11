# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the test coverage goal by adding unit tests for core Firebase Firestore helper functions. Vitest is already configured as the test runner.

## Objective

Add Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a separate test file)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding or modifying test scripts if absolutely necessary, e.g., to ensure `npm test` runs vitest for this file, but assume `vitest` is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions within `src/lib/firestore.ts`. Examples might include functions for fetching or adding nail items, or any other primary CRUD operations.
- Ensure Firebase SDK dependencies are mocked using `vitest`'s mocking capabilities (e.g., `vi.mock`).
- The test code should be clear and follow best practices for unit testing.
- Keep the diff for this task ≤ 150 lines. Focus on testing core logic rather than achieving 100% coverage in a single PR.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
