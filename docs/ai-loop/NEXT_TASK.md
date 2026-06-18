# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to increase test coverage for core utility functions.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest, specifically targeting basic functionality and error handling for item retrieval.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testability, but focus is on testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (for Vitest configuration, if necessary, but assume existing setup)
- `package.json` (for adding `test` script if missing, but no new dependencies)

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
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/app`) as needed using `vi.mock`.
- Write unit tests for at least the `getItemById` and `getItems` functions, covering:
    - Successful data retrieval.
    - Error handling (e.g., when Firestore operations fail).
    - Edge cases like an item not found (for `getItemById`).
- Ensure tests are isolated and do not interact with a live Firebase project.
- Run `npm run build && npm run lint && npm run test` before finishing.
- All new tests must pass.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
