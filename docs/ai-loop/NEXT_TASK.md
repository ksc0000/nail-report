# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for the application's core logic.

## Objective

Implement unit tests for one or more helper functions within `src/lib/firestore.ts` using Vitest. This task focuses specifically on the Firestore-related utilities, ensuring their reliability and paving the way for further test coverage.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is not already complete for `src/lib` files)
- `package.json` (only to ensure `vitest` scripts are present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file for `firestore.ts` helpers within `src/__tests__/`.
- Use Vitest and mock Firebase SDK dependencies as needed (e.g., `vi.mock('firebase/firestore')`).
- Write at least one passing test for a helper function in `src/lib/firestore.ts` (e.g., `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
- Run `npm run test` and ensure new tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
