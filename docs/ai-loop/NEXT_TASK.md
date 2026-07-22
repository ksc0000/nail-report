# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key objective in Phase 2.1 is to add unit tests for Firebase helper functions. The `src/lib/firestore.ts` file contains essential functions for interacting with the Firestore database, and these functions currently lack unit test coverage.

## Objective

Implement unit tests for functions within `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking Firebase SDK dependencies to isolate the functions under test.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments if needed for testability)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (if minor Vitest configuration is necessary, but prefer to use existing config)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions in `src/lib/firestore.ts`. Focus on a mix of CRUD operations, e.g., `addNailItem` and `getNailItems`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover both successful execution paths and basic error handling where applicable.
- Keep the overall diff ≤ 150 lines, including the new test file and any minor changes to `firestore.ts` if required for testability.
- Run `npm run build && npm run lint && npm run test` before finishing and ensure all tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
