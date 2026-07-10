# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key area is to improve test coverage for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer testing existing public API)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor modifications if needed for mocks, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions in `src/lib/firestore.ts` (e.g., `addItem`, `updateItem`, `deleteItem`, `getNailItems`, etc.).
- Use Vitest and mock Firebase SDK dependencies (Firestore and Auth) as needed.
- Focus on testing the logic within the `firestore.ts` helpers, not the Firebase SDK itself.
- Ensure tests run successfully.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
