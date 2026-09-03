# Worker Prompt Template

## Context

Phase 2.1 of the roadmap focuses on improving test coverage. This task is the first step towards adding unit tests for core helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but focus on testing existing logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minimal Vitest configuration if required, e.g., for `globals`)
- `package.json` (only for adding `test` script, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Add a new test file `src/__tests__/firestore.test.ts`.
- Use Vitest as the test runner.
- Mock the Firebase Firestore SDK using `vi.mock` to prevent actual Firebase calls during tests.
- Write unit tests for at least one helper function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`).
- Ensure tests verify that the correct Firestore methods (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) are called with the expected arguments.
- Run `npm run build && npm run lint` before finishing.
- Do not add new npm dependencies.
- Ensure `npm test` runs the new tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
