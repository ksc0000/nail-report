# Worker Prompt Template

## Context

The current focus is Phase 2 of the product roadmap, specifically improving stability and test coverage. This task initiates the test coverage efforts by targeting core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (existing file, minor changes for testability if necessary)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `vite.config.ts` (only if Vitest configuration is missing or needs adjustment, unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Write unit tests covering the public helper functions exported from `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock` as needed to isolate `firestore.ts` logic.
- Ensure tests are robust and verify expected behaviors, including success and potential error paths where applicable to the helper function's responsibility.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
