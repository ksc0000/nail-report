# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX. This task will initiate the test coverage improvements by adding unit tests for core Firebase utility functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Specifically, focus on testing functions that interact with the Firestore `nailItems` collection (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `subscribeToNailItems`), ensuring Firebase SDK calls are properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if necessary, but prefer testing existing interface)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if needed for basic setup, though Vitest should be pre-configured)
- `package.json` (only for adding `vitest` script if missing, no new `dependencies` or `devDependencies`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` `dependencies` or new `devDependencies` (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem` and `deleteNailItem`).
- Use `vi.mock` to mock Firebase Firestore SDK interactions, avoiding actual database calls during tests.
- Ensure tests cover successful operations and basic error scenarios if applicable to the mocked functions.
- Keep the test diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
