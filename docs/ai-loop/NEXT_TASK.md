# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on adding foundational unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. The tests should mock Firebase SDK dependencies and cover basic CRUD operations or data manipulation functions within that file.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but focus on testing existing code)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration or setup for mocking Firebase is needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`.
- Ensure tests effectively mock the Firebase Firestore SDK using `vi.mock` as appropriate, so that no actual Firebase calls are made.
- Assert expected function behaviors and error conditions.
- Keep the overall diff size to under 150 lines.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
