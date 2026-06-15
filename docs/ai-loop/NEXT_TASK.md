# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by targeting core utility functions. The current state shows that no substantive product-related tasks have been completed by the AI loop yet, making this the first implementation task.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`, specifically focusing on the `nailItems` CRUD operations (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`). Utilize Vitest as the test runner and mock Firebase SDK dependencies using `vi.mock`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if necessary to make functions testable)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `package.json` (only to add/modify `test` script if not present, without adding new dependencies)
-   `vite.config.ts` (minor adjustments for Vitest configuration, e.g., `test.include`, if absolutely necessary and without adding new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Mock Firebase SDK dependencies using Vitest's `vi.mock` mechanism.
-   Ensure tests cover successful operations and basic error scenarios for the targeted functions.
-   The `test` script in `package.json` should invoke `vitest`. If it doesn't exist, add `"test": "vitest"`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
