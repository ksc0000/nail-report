# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" goal by adding unit tests for the existing Firebase Firestore helper functions. Vitest is already designated as the test runner.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing exports)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (No changes expected for this task)
- Any component files for importing/using the `firestore.ts` functions (No changes expected for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed (e.g., `firebase/firestore`, `firebase/app`) using `vi.mock` to ensure unit isolation.
- Write tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `createPublicShare`, etc.).
- Ensure tests cover successful operations and basic error handling where applicable.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
