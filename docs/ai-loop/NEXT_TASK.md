# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically targets improving test coverage for core Firebase helper functions.

## Objective

Add comprehensive unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, including necessary Firebase SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported helpers)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only for Vitest configuration if absolutely necessary, but prefer to use existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in Allowed Scope

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Implement mocks for Firebase SDK functions (`firebase/firestore` and `firebase/app`) as required to isolate `src/lib/firestore.ts` functions for unit testing.
- Write unit tests for all exported helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or similar CRUD operations related to nail items).
- Ensure test cases cover successful operations and expected error handling if applicable to the tested functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing to ensure code quality and no build errors.
- Tests should be executable via `npm run test` and pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
