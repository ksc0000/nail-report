# Worker Prompt Template

## Context

The current phase of the `nail-report` application development focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on basic CRUD operations and error handling scenarios where applicable.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, e.g., exporting non-exported helpers)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `package.json` (only to add a `vitest` script if not already present, no new dependencies)
- `vite.config.ts` (to configure Vitest if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except if `vitest` itself needs adding as a dev dependency and it's not already there)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use `vitest` for testing and `vi.mock` to mock Firebase SDK dependencies.
- Ensure tests cover successful operations and at least one error path (e.g., a Firestore operation failing).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
