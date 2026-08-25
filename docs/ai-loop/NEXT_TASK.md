# Worker Prompt Template

## Context

The current phase is 2.0, focusing on stability, test coverage, and UX improvements. The AI Loop has just completed its setup tasks, and this is the first substantive product development task.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This directly addresses the "2.1 Test coverage" goal from the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection of functions to test)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, but prefer to mock directly in tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on testing a few core helper functions first.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`, for the tests.
- Mock Firebase SDK dependencies as needed to enable isolated unit testing of `firestore.ts` functions.
- Cover at least 2-3 key helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
