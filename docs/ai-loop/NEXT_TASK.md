# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that Vitest for unit testing is a priority.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task focuses on establishing initial test coverage for a critical library file.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting a non-exported function, but prefer not to alter functionality)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (minor additions for Vitest configuration if absolutely necessary, but assume Vitest is runnable)
-   `package.json` (only to add `test` script if missing, no new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for `vite.config.ts`.

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Add at least two unit tests for distinct functions or code paths within `src/lib/firestore.ts`.
-   Mock Firebase SDK dependencies (e.g., `firebase/firestore`) as necessary to isolate the `firestore.ts` functions for testing.
-   Ensure tests are isolated and do not interact with actual Firebase services.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   The task should not introduce new npm dependencies.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
