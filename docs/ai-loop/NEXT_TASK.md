# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" aspect by adding unit tests for core Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions in `src/lib/firestore.ts`, focusing on mocking Firebase SDK calls to ensure isolation and accurate testing of the business logic within the helpers.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not to alter core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions for test configuration if needed, e.g., global mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Implement unit tests for at least `addNailItem`, `getNailItems`, and `deleteNailItem` from `src/lib/firestore.ts`.
- Mock Firebase Firestore SDK calls using `vitest`'s mocking capabilities (`vi.mock`).
- Ensure tests run successfully and cover typical success and error scenarios.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
