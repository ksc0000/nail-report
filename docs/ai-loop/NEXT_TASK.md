# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. A key area for improvement is adding unit tests for existing helper functions. This task specifically targets the Firebase Firestore helper functions to ensure their correctness and robustness.

## Objective

Add Vitest unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `package.json` (only for adding a `test` script if not present, no new dependencies)
- `vite.config.ts` (minor additions for test configuration if strictly necessary, but prefer to configure within test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Add unit tests for the following functions within `src/lib/firestore.ts`:
    - `getNailItems`
    - `getNailItem`
    - `addNailItem`
    - `updateNailItem`
    - `deleteNailItem`
- The tests must mock the Firebase Firestore SDK using `vi.mock` to isolate the functions under test and prevent actual Firebase calls.
- For `getNailItems` and `getNailItem`, mock the respective Firestore query and document snapshot functions to return predefined test data.
- For `addNailItem`, `updateNailItem`, and `deleteNailItem`, ensure mocks correctly simulate successful operations.
- Ensure the diff for this task remains ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- All tests must pass when running `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
