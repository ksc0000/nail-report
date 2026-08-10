# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. Vitest has been selected as the test runner. This task aims to improve the test coverage by adding unit tests for core Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily to understand what to test)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if Vitest or testing utilities are missing from `devDependencies` and are strictly required for *this* task, otherwise avoid) - *Self-correction: The roadmap implies Vitest is set up, so no `package.json` changes should be needed for adding dependencies.*
- `vite.config.ts` (if minor configuration is needed for test setup, e.g., aliases)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, unless absolutely necessary for Vitest setup which should already be done)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two distinct helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Effectively mock Firebase SDK dependencies (e.g., `firebase/firestore`) to ensure tests are isolated and do not interact with a live Firestore instance.
- Ensure all new tests pass when running `npm test`.
- The total diff for this task (including test file and any minor changes to `firestore.ts` for testability) must be ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items (e.g., testing more functions, improving mocking strategies) as comments in the PR, not as additional code within this task.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
