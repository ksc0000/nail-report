# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests to the existing Firestore helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but prefer to only add tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add a `test` script if not already present, or to configure vitest, but *not* to add new npm dependencies)
- `vite.config.ts` (for Vitest configuration if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, beyond Vitest which is already assumed for phase 2)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts`, such as `addItem`, `updateItem`, `deleteItem`, or `getItem`.
- Ensure Firebase SDK calls (e.g., `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`) are properly mocked using `vitest`'s mocking capabilities (`vi.mock`).
- The tests should verify the correct arguments are passed to the mocked Firebase functions and that the helper functions return expected values or throw errors as appropriate.
- Keep the diff for this task ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` to ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
