# Worker Prompt Template

## Context

The current phase is "2.0 Active", focusing on stability, test coverage, and UX. This task directly addresses "2.1 Test coverage" by implementing unit tests for core Firebase utility functions. Vitest is already listed as the test runner in the roadmap.

## Objective

Add unit tests for the helper functions located in `src/lib/firestore.ts`. Focus on mocking Firebase SDK calls to ensure tests are fast and isolated.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to enable testability if necessary, but keep changes minimal)
- `src/__tests__/firestore.test.ts` (new file for the tests)
- `vitest.config.ts` (if minor adjustments for mocks are needed, but prefer to keep it stable)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` to isolate tests from actual Firebase calls.
- Write tests covering the main helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getPublicShare`).
- Ensure tests assert correct function calls and returned values.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` to verify new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
