# Worker Prompt Template

## Context

The current roadmap for `nail-report` focuses on improving stability, test coverage, and UX in Phase 2. One key aspect is increasing test coverage for helper functions.

## Objective

Add unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minimal modifications if absolutely required for mocks)

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
- Mock Firebase SDK dependencies as needed to isolate `firestore.ts` functions.
- Write at least one unit test for each public helper function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.).
- Ensure tests cover basic success cases. Error handling tests are not strictly required for this task but can be added if simple.
- Run `npm run test` to confirm tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
