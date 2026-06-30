# Worker Prompt Template

## Context

The application needs improved test coverage, starting with core Firebase helper functions. `src/lib/firestore.ts` contains crucial functions for interacting with the Firestore database, and these need robust unit tests.

## Objective

Add Vitest unit tests for the public helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (specifically `src/lib/firestore.ts`)
- `src/__tests__/` (new test files, e.g., `src/lib/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is needed, but prefer to keep it minimal)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file for `firestore.ts` functions, e.g., `src/lib/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`) using `vi.mock` to isolate the functions under test.
- Write unit tests for at least `addNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems`. Focus on verifying correct Firestore calls and data handling.
- Ensure tests run successfully with `npm test`.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (this task *is* about adding tests).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
