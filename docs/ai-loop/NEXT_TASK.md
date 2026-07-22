# Worker Prompt Template

## Context

The application is in Phase 2, focusing on stability, test coverage, and UX. This task will initiate the test coverage efforts by adding unit tests for a core utility file.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files as needed for mocks)
- `vite.config.ts` (if Vitest setup is needed, but should already be configured for `vi.mock`)

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
- Mock Firebase SDK functions using `vi.mock` where necessary to isolate `firestore.ts` logic.
- Cover at least the `addNailItem`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts` with basic unit tests.
- Ensure tests run successfully using `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions.

1.  Create a new file `src/__tests__/firestore.test.ts`.
2.  Import the functions from `src/lib/firestore.ts` that you intend to test.
3.  Set up Vitest mocking for Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`) within `src/__tests__/firestore.test.ts` to simulate Firestore behavior without actual database calls. Refer to existing test setups for mocking patterns if available.
4.  Write unit tests for at least the `addNailItem`, `updateNailItem`, and `deleteNailItem` functions.
    *   Test successful scenarios.
    *   Test error handling (e.g., if a Firestore operation fails, does the helper function propagate the error correctly?).
5.  Ensure the tests are isolated and do not interact with a live Firebase project.
6.  Run `npm test` to confirm all tests pass.
7.  Run `npm run build && npm run lint` and address any issues.
