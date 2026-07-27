# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on stability, test coverage, and UX improvements. One of the key objectives in Phase 2.1 is to increase test coverage for core helper functions, specifically mentioning `src/lib/firestore.ts`. Vitest is the designated test runner.

## Objective

Implement unit tests for essential CRUD operations within `src/lib/firestore.ts` using Vitest. The focus should be on mocking Firebase SDK dependencies to ensure tests are isolated and run efficiently.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, or minor refactors)
- `src/__tests__/firestore.test.ts` (new test file for `firestore.ts` functions)
- `vite.config.ts` (if minor Vitest configuration for mocking is absolutely necessary, but prefer to assume Vitest is already set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add unit tests for at least the `addItem`, `updateItem`, and `deleteItem` functions in `src/lib/firestore.ts`.
- Ensure Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`) are properly mocked using `vi.mock` to isolate tests from actual Firebase calls.
- Write clear, concise, and effective test cases covering success paths.
- Keep the total diff size for the pull request to ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing to ensure code quality and test pass.
- Report any follow-up items as comments in the PR, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
