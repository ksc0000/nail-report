# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The primary focus should be on mocking Firebase SDK calls and testing the logic of these functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (if needed for basic setup, though existing setup might suffice)
- `package.json` (only to add a `test` script if not already present, do NOT add new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, ensure Vitest is already configured)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`) using `vi.mock`.
- Write unit tests for at least 2-3 key functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`).
- Ensure tests verify both successful operations and potential error conditions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
