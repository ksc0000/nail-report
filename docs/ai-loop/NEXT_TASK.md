# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firebase Firestore helper functions. The application uses Vitest for testing, which is assumed to be configured for running tests.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. This includes setting up mocks for the Firebase SDK (Firestore specifically) to enable isolated testing of these functions without actual database calls.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (minor modifications to Vitest configuration if required to run tests, without adding new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` to house the new tests.
- Mock the Firebase Firestore SDK (e.g., `firebase/firestore`) to prevent actual database interactions during tests.
- Write unit tests for at least two key CRUD-related helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`).
- Ensure tests cover basic success cases and error handling where applicable for the chosen functions.
- Run `npm run build && npm run lint` before finishing.
- Ensure `npm test` or `vitest` can successfully run the newly added tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
