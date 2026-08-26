# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves implementing a test file, setting up Firebase SDK mocking, and writing tests for at least one critical helper function.

## Allowed Scope

-   `src/lib/firestore.ts` (for the functions under test)
-   `src/__tests__/lib/firestore.test.ts` (new test file for tests)
-   `vite.config.ts` (minor updates if necessary for Vitest configuration, e.g., glob patterns)
-   `package.json` (only to add or modify a test script, no new npm dependencies)

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
-   Add Vitest unit tests for at least one key helper function in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`).
-   Mock Firebase SDK dependencies (Firestore and potentially Auth if used by the tested functions) using `vi.mock` to isolate the tests from actual Firebase calls.
-   Ensure the added tests pass successfully.
-   The new test file should be named `src/__tests__/lib/firestore.test.ts`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
