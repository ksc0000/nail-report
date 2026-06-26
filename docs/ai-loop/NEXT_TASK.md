# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for selected helper functions in `src/lib/firestore.ts`, specifically focusing on `addItem` and `deleteItem`. This includes setting up Firebase SDK mocking using `vitest` and `vi.mock`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor modifications for Vitest setup if not already complete)

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
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Add unit tests for `addItem` and `deleteItem` functions within `src/lib/firestore.ts`.
- Implement mocking for Firebase SDK dependencies using `vitest` and `vi.mock` to ensure tests run in isolation without actual Firebase calls.
- Ensure `npm run test` successfully executes the newly added tests.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
