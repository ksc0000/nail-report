# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. This task specifically addresses `2.1 Test coverage`. The current state shows that no substantive tasks have been completed by the AI Loop yet, making this a foundational step for improving code quality.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`. The focus should be on covering the core CRUD operations for nail items that interact with Firestore.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but primarily adding tests)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if necessary for Firebase mocking setup, but prefer existing setup)
- `package.json` (only if updating `scripts` for test command, no new `dependencies` or `devDependencies`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` `dependencies` or `devDependencies` (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope".

## Requirements

- Create a new test file, e.g., `src/__tests__/lib/firestore.test.ts`.
- Implement unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use Vitest for testing.
- Mock Firebase SDK dependencies as necessary to ensure tests are isolated unit tests (e.g., `firebase/firestore`, `firebase/auth`).
- Ensure the tests can run successfully in an Ubuntu environment.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
