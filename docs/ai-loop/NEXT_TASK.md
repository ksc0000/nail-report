# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" goal by adding unit tests for critical utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on mocking Firebase SDK dependencies to ensure isolated testing of the utility logic.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally only add tests)
- `src/__tests__/` (create `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if necessary for mocking setup, but prefer `vi.mock` directly in test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories outside the allowed scope.

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `getNailItems`, `deleteNailItem`).
- Use `vitest` and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Tests should assert correct function calls to mocked Firebase methods and proper return values.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
