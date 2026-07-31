# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key objective for this phase is to increase unit test coverage, particularly for core utility functions that interact with Firebase.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This task aims to improve the stability and maintainability of the application's Firestore interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors for testability)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `src/__tests__/` (any other new test files related to `firestore.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/firestore.test.ts`.
- Write unit tests for the following functions in `src/lib/firestore.ts`:
    - `addNailItem`
    - `getNailItem`
    - `updateNailItem`
    - `deleteNailItem`
- Ensure tests effectively mock the Firebase Firestore SDK to prevent actual database calls and to ensure isolated, fast execution.
- Aim for good statement coverage for the tested functions.
- Keep the overall diff for this task ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` and ensure all commands pass before finishing.
- Do not add any new npm dependencies.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
