# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-phase is "2.1 Test coverage." Establishing a robust testing suite for core helper functions is a priority.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`. This involves setting up basic test files and mocking the Firebase SDK as needed to test Firestore interactions without live database calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes might be needed for testability, e.g., exporting unexported functions if necessary, but prefer not to alter functionality)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration additions are needed, e.g., for mocks)
- `package.json` (only to add `vitest` script if not already present, but *not* new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions within `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest for testing. If Vitest is not fully configured, add minimal configuration to `vite.config.ts` to allow it to run tests.
- Mock the Firebase SDK (`firebase/firestore` and `firebase/app`) to isolate tests from actual Firebase services.
- Ensure tests run successfully and provide meaningful coverage for the selected functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
