# Worker Prompt Template

## Context

The current phase is "Phase 2 — Active", focusing on stability, test coverage, and UX improvements. This task specifically addresses "2.1 Test coverage" by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves creating a new test file and mocking Firebase SDK dependencies as needed.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are permissible if necessary, but the primary focus is testing its existing functions)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one core helper function within `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, etc.).
- Ensure Firebase SDK calls within the `firestore.ts` helpers are properly mocked using `vi.mock` to isolate the unit tests from actual Firebase interactions.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
