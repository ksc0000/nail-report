# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The current focus is on Phase 2, which involves improving stability, test coverage, and UX.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is needed, e.g., for `vi.mock`)
- `package.json` (only to add `test` script if not present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts`. Examples include functions for fetching or adding nail items, or any utility functions that interact with Firestore.
- Mock Firebase SDK calls as necessary using `vi.mock` to ensure tests are isolated and do not hit actual Firebase services.
- Ensure the tests cover basic functionality and edge cases where applicable (e.g., successful operations, error handling).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
