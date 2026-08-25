# Worker Prompt Template

## Context

The `nail-report` application needs improved stability and test coverage. Phase 2.1 of the roadmap focuses on adding unit tests for core helper functions. Your current task is to begin this process by adding tests for the Firestore utility functions.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding functions to test, minor refactoring to enable testing is acceptable)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock the Firebase SDK (`firebase/firestore`) using `vitest`'s `vi.mock` to isolate the `firestore.ts` functions from actual Firebase calls.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` that interact with Firestore (e.g., functions for adding, fetching, or updating nail items).
- Ensure tests cover typical successful execution paths and basic error scenarios for the chosen functions.
- Add clear descriptions for test suites and individual tests.
- Keep the overall diff for this task ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
