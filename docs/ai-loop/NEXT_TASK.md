# Worker Prompt Template

## Context

The application needs improved test coverage as part of Phase 2 of the roadmap. The `src/lib/firestore.ts` file contains critical helper functions for interacting with Firebase Firestore, and these functions require dedicated unit tests to ensure their stability and correctness.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves setting up mocks for Firebase SDK dependencies to isolate the functions for testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not to change production code unless required for mocks)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if new Vitest configuration is needed, but prefer to use existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory other than `vitest.config.ts`.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure Firebase SDK dependencies are properly mocked using `vitest` and `vi.mock` to prevent actual Firebase calls during tests.
- The tests should verify the correct arguments are passed to mocked Firebase functions and that the functions handle success and error cases as expected.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
