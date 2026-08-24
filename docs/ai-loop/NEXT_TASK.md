# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will contribute to Phase 2.1 by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering basic CRUD operations (add, get, update, delete) and data transformation logic relevant to the `nailItems` collection.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minimal configuration is needed for Firebase mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new *unplanned* npm packages; assume Vitest is already configured or add minimal config if necessary)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies using `vitest` and `vi.mock` to ensure tests are isolated and run offline.
- Cover at least the `addNailItem`, `getNailItem`, `updateNailItem`, and `deleteNailItem` functions from `src/lib/firestore.ts`.
- Ensure tests pass with mock data.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
