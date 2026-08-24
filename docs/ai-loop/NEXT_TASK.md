# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage improvements by adding unit tests for a core Firebase library. Vitest is specified as the test runner.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking the Firebase SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (for reading helper function signatures, no changes to logic)
-   `src/__tests__/firestore.test.ts` (create this new test file)
-   `package.json` (only to confirm Vitest setup, no new dependencies)
-   `vite.config.ts` (only to confirm Vitest setup)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least one helper function in `src/lib/firestore.ts` (e.g., `getNailItems`, `createNailItem`, `updateNailItem`, `deleteNailItem`).
-   Properly mock the Firebase Firestore SDK using `vi.mock` to isolate the functions under test from actual Firebase calls.
-   Ensure tests verify the correct interaction with the mocked Firebase SDK (e.g., correct `collection`, `doc`, `set`, `get` calls).
-   Keep the diff for this task ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` or `vitest` to verify tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
