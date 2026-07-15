# Worker Prompt Template

## Context

The current phase is "Phase 2 — Active," focusing on improving stability, test coverage, and UX. Specifically, "2.1 Test coverage" aims to add unit tests for `src/lib/firestore.ts`, `src/lib/storage.ts`, and `src/lib/auth.ts` using Vitest with Firebase SDK mocking. This task focuses on the `firestore.ts` helpers.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest, ensuring Firebase SDK calls are appropriately mocked.

## Allowed Scope

- `src/lib/firestore.ts` (only to ensure testability, no functional changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if minor Vitest configuration is needed, but prefer to assume it's set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related files

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least one core helper function within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`).
- Mock Firebase SDK functions (Firestore-related calls) using `vi.mock` to isolate tests from actual Firebase interactions.
- Ensure `npm test` runs successfully and all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
