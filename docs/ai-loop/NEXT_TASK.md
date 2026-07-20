# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task addresses the "Test coverage" objective by adding foundational unit tests for core Firebase Firestore helper functions.

## Objective

Implement Vitest unit tests for key helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only to add a `test` script if not present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two helper functions from `src/lib/firestore.ts`. Recommended targets are `getNailItems` and `addNailItem`.
- Mock Firebase Firestore SDK methods (e.g., `getDocs`, `addDoc`) using `vi.mock` as required to isolate the logic of the helper functions.
- Ensure tests cover successful execution paths for the chosen functions.
- The `package.json` must NOT be modified to add any new npm dependencies. Vitest is expected to be already configured for running tests.
- Keep total diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` (or `vitest`) and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
