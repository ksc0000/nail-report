# Worker Prompt Template

## Context

The current phase is "2.0: Improve stability, test coverage, and UX". The immediate goal is to enhance test coverage for core utility functions. Vitest is already set up in the project.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` to improve test coverage. Focus on a few key functions to keep the PR small.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only for testability, if strictly necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration changes are needed for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other `src/lib/` files not directly related to `firestore.ts` testing.

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`.
- Implement mocking for Firebase SDK dependencies using `vitest` and `vi.mock` as needed.
- Ensure tests cover typical success cases and basic error handling or edge cases for the selected functions.
- Keep the overall diff (including the new test file) ≤ 150 lines.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report any follow-up items or functions not tested as comments in the PR description.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
