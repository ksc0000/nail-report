# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage efforts by adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The primary goal is to ensure these functions are correctly tested in isolation by mocking the Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (if `vitest` needs to be initialized, but no new dependencies)
- `vite.config.ts` (if Vitest configuration is needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly mentioned in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions in `src/lib/firestore.ts` (e.g., functions related to adding, getting, or updating nail items).
- Mock the Firebase Firestore SDK using `vi.mock` to ensure tests run in isolation without hitting actual Firebase services.
- Ensure the tests assert expected behavior and error conditions.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
