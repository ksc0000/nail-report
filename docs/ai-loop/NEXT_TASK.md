# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by setting up Vitest for Firebase SDK mocking and implementing initial unit tests for core Firestore helper functions. No substantive Phase 2 task has been completed yet.

## Objective

Implement Vitest setup for Firebase SDK mocking and write initial unit tests for the `addItem` and `updateItem` helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (for potential minor refactoring to improve testability, if necessary)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vite.config.ts` (for minimal Vitest configuration required for Firebase SDK mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- **Acceptance Criteria**:
    1.  `vite.config.ts` is updated (if necessary) to configure Vitest for mocking Firebase SDK modules (e.g., `firebase/firestore`).
    2.  A new test file, `src/__tests__/lib/firestore.test.ts`, is created.
    3.  Unit tests are written within `src/__tests__/lib/firestore.test.ts` for at least the `addItem` and `updateItem` functions from `src/lib/firestore.ts`.
    4.  These tests effectively mock Firebase Firestore operations to run in isolation without actual database calls.
    5.  All new tests pass when `npm run test` is executed.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
