# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for existing helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testing setup if needed, but primarily creating tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration changes are needed for mocking, though Vitest is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory (except potentially `vitest.config.ts` if strictly necessary for mocking Firebase SDK).
- `src/App.css` or other UI-related files.

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions exported from `src/lib/firestore.ts`. Focus on functions that perform data manipulation or basic Firestore interactions (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`).
- Mock the Firebase SDK as necessary to isolate the functions under test using `vi.mock`.
- The tests should verify the correct arguments are passed to the mocked Firebase functions and handle successful outcomes. Error handling tests can be added as a follow-up.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure the new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
