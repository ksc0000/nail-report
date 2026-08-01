# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will contribute to the "2.1 Test coverage" goal by adding unit tests for existing helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on ensuring that the basic CRUD operations (add, get, update, delete) and data transformation functions are correctly tested, using Firebase SDK mocking where necessary.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if needed, but primary focus is testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, but avoid adding new deps)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for the functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest and mock Firebase SDK dependencies (e.g., `firebase/firestore`) to isolate the `firestore.ts` logic.
- Ensure the tests cover typical success cases and basic error handling where applicable within the tested functions.
- Keep diff ≤ 150 lines.
- Run `npm run test` and ensure all new tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
