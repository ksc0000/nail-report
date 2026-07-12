# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage. `src/lib/firestore.ts` contains crucial helper functions for interacting with Firebase Firestore. Adding unit tests for these functions will increase the reliability of the application and reduce regressions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer not to alter core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only if absolutely necessary for test configuration, but Vitest should already be set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock()`.
- Cover at least 2-3 key helper functions in `src/lib/firestore.ts` with unit tests. Examples: `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`.
- Ensure tests cover both successful operations and error handling cases (if applicable to the helper function).
- Run `npm run test` and ensure all new tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
