# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The project is in Phase 2, focusing on improving stability, test coverage, and UX. A key objective for Phase 2.1 is to add unit tests for Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on a few key functions to keep the PR small.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for test setup, e.g., aliases)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies using `vi.mock` as appropriate for `firestore.ts` functions.
- Write tests for at least two functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
- Ensure tests cover basic success and error paths.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
