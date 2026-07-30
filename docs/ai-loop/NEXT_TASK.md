# Worker Prompt Template

## Context

The product roadmap indicates a focus on improving stability and test coverage in Phase 2. This task aims to kickstart the test coverage efforts by adding unit tests for a critical Firebase-related helper module.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. These tests should mock Firebase SDK dependencies to ensure they are true unit tests, isolated from actual Firebase interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only for adding `test` script if not present or adjusting `vitest` config if strictly necessary, but prefer to assume `vitest` is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file at `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `subscribeToNailItems`).
- Use `vitest` as the test runner.
- Mock Firebase SDK modules (e.g., `firebase/firestore`) using `vi.mock` to prevent actual network calls and maintain test isolation.
- Ensure the tests cover various scenarios for each function, including successful operations and potential error paths.
- Keep the diff for this task to ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` and ensure all pass before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
