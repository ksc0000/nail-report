# Worker Prompt Template

## Context

Phase 2 of the roadmap focuses on improving stability, test coverage, and UX. This task directly addresses "2.1 Test coverage" by adding unit tests for core Firebase Firestore helper functions, which is crucial for application stability.

## Objective

Add Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`. The focus should be on covering the main CRUD operations (add, get, update, delete) or any other significant utility functions within this file.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but prefer to mock)
- `src/__tests__/` (e.g., creating `src/__tests__/firestore.test.ts` and adding test suites)
- `vite.config.ts` (only if Vitest configuration *strictly* needs adjustment for mocking; otherwise, assume it's set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to isolate `src/lib/firestore.ts` functions.
- Write at least 2-3 meaningful unit tests for key helper functions in `src/lib/firestore.ts`.
- Ensure tests pass with `npm test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
