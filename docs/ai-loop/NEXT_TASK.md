# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal. The application uses Firebase Firestore helper functions, and ensuring their correctness through unit tests is a high priority.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions for Vitest setup if strictly necessary, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any files outside `src/lib/firestore.ts`, `src/__tests__/`, or `vite.config.ts`.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Write unit tests for at least two core helper functions in `src/lib/firestore.ts` (e.g., `addItem`, `updateItem`, `deleteItem`, `getPublicShareLink`).
- Ensure tests cover basic success and error paths where applicable.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
