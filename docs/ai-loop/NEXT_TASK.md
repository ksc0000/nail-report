# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current task is to begin addressing test coverage by adding unit tests to the core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration, if not already set up or needs adjustment)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Focus on testing key CRUD helper functions in `src/lib/firestore.ts` such as `createNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems`.
- Mock Firebase SDK dependencies (Firestore, Auth, Storage) using `vi.mock` as appropriate to isolate `firestore.ts` logic.
- Ensure tests are robust and cover common scenarios (success, item not found, basic error handling).
- Keep the diff ≤ 150 lines. If testing all functions exceeds this, prioritize the most critical ones for this task.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
