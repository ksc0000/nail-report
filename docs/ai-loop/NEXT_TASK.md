# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, which focuses on improving stability, test coverage, and UX. The first major item in Phase 2 is enhancing test coverage. This task initiates the process by adding unit tests for the core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`. This involves setting up Vitest for testing, mocking the Firebase SDK, and writing comprehensive tests for the primary Firestore operations.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactoring for testability, if strictly necessary, but focus on testing existing logic)
-   `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `vite.config.ts` (for Vitest configuration, if needed)
-   `package.json` (to add a `test` script, if not already present, but strictly no new npm dependencies)

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
-   Ensure all newly added tests pass when running `npm run test` (or the equivalent Vitest command).
-   Create a new test file named `src/__tests__/firestore.test.ts`.
-   Mock the Firebase SDK (Firestore-related functions) to isolate unit tests from actual Firebase calls.
-   Tests should cover key helper functions in `src/lib/firestore.ts` such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, and any other significant data access functions. Aim for good coverage of the logic within these functions, including success and error paths where applicable.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
