# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. The first step in Phase 2.1 is to add unit tests for critical helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking Firebase SDK dependencies as necessary.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testability, but focus is on testing existing code)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (for Vitest configuration if necessary, though Vitest should be pre-configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions within `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) as needed to isolate `firestore.ts` functions.
- Ensure tests cover typical usage and edge cases.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
