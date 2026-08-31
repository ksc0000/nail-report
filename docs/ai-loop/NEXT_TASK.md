# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`. Focus on testing the primary CRUD operations and data marshalling logic within this file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minor additions if needed for Firebase mock setup, but prefer existing configuration)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock()` to isolate `firestore.ts` functions.
- Write tests for at least two functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`).
- Ensure tests cover successful operations and basic error handling where applicable.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
