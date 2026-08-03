# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key objective in Phase 2.1 is to increase test coverage, specifically for helper functions in `src/lib/`. The current state indicates that `Vitest` is the chosen test runner and mocking Firebase SDK is part of the strategy.

This task aims to improve the stability of the application by adding unit tests for a critical helper module.

## Objective

Implement unit tests using Vitest for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, e.g., exporting unexported functions if needed)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but prefer to assume it's set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Mock Firebase Firestore SDK calls using Vitest's mocking capabilities to ensure tests are isolated and do not interact with a live database.
- Ensure the tests cover basic success and error paths for the chosen functions.
- Keep the diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Ensure `npm run test` passes after adding the new tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
