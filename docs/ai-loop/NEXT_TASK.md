# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability and test coverage. This task aims to increase test coverage for core Firebase helper functions. This is the first substantive task being tackled by the AI Loop.

## Objective

Write unit tests using Vitest for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (minor modifications to export functions if strictly necessary for testing, but avoid altering existing functionality)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (CSS improvements - not relevant for this task but generally allowed)
- `vitest.config.ts` (minor changes if necessary for mocking, but avoid adding new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, for example, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions within `src/lib/firestore.ts`. Good candidates include `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
- Mock Firebase SDK dependencies as needed using `vitest`'s mocking capabilities (e.g., `vi.mock('firebase/firestore')`).
- Ensure all new tests pass successfully.
- Keep the diff size for the entire PR ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report any follow-up items or suggested further tests as comments in the PR, not as additional code changes.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
