# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key area is increasing test coverage for core utility functions. The `src/lib/firestore.ts` file contains essential helper functions for interacting with Firebase Firestore, and these functions require robust unit tests.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK dependencies appropriately to ensure isolation.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if necessary)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `vite.config.ts` (minor additions for Vitest setup if needed, e.g., aliases for mocks)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for `vite.config.ts` for Vitest config.

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file `src/__tests__/lib/firestore.test.ts`.
-   Write tests for at least two key helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
-   Use `vitest` and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
-   Tests should be isolated and not require a live Firebase project connection.
-   Ensure all existing tests (if any) and the new tests pass.
-   Run `npm run build && npm run lint` before finishing and report results.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`)
