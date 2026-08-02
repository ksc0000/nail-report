# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that test coverage is a priority. This task will initiate the process of adding unit tests to the application's core logic.

## Objective

Add Vitest unit tests for helper functions in `src/lib/firestore.ts`, specifically focusing on basic CRUD operations related to `nailItems` and `publicShares`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactoring for testability if strictly necessary, but prefer to keep changes minimal)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (only to add `vitest` scripts if not already present, but *not* to add new dependencies)
-   `vite.config.ts` (only for Vitest configuration if necessary)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any UI components or CSS files

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Implement tests for at least two functions from `src/lib/firestore.ts` (e.g., `addItem`, `updateItem`, `deleteItem`, `getNailItem`, `getPublicShare`).
-   Use `vitest` for the test runner.
-   Mock Firebase SDK (Firestore) using `vi.mock` to ensure tests run in isolation without actual Firebase calls.
-   Ensure tests are clean, readable, and cover basic success cases.
-   Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
