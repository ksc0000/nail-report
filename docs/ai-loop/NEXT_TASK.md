# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the process of adding comprehensive test coverage for core Firebase helper functions. Vitest is the designated test runner for the project.

## Objective

Implement initial unit tests for the helper functions located within `src/lib/firestore.ts` using Vitest. This task should establish a basic testing pattern for Firebase-related utilities, focusing on mocking the Firebase SDK correctly.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but prefer to keep helper functions pure)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `package.json` (only if a `test` script needs to be added or modified to run Vitest tests, but do NOT add new npm dependencies)
-   `vite.config.ts` (if Vitest configuration for mocking is needed, but do NOT add new npm dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for specific configuration files as noted above.

## Requirements

-   Create a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Write at least one unit test for a helper function within `src/lib/firestore.ts` (e.g., `getNailItems`, `createNailItem`).
-   Properly mock the Firebase SDK (Firestore) using `vi.mock` to isolate the function under test from actual Firebase calls.
-   Ensure tests are fast and do not rely on a live Firebase connection.
-   Keep the overall diff size to ≤ 150 lines.
-   Verify that the existing `npm run build` and `npm run lint` commands pass.
-   Add an `npm run test` script to `package.json` if it doesn't exist and configure it to run Vitest. Ensure this does not add new npm dependencies. If Vitest is already configured to run with `npm run test` or similar, ensure the new tests are included.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Acceptance Criteria

-   A new file `src/__tests__/lib/firestore.test.ts` exists.
-   This file contains at least one passing unit test for a function from `src/lib/firestore.ts`.
-   The test effectively mocks Firebase Firestore, preventing actual network requests.
-   `npm run build` completes successfully.
-   `npm run lint` completes successfully.
-   `npm run test` (or equivalent Vitest command) runs successfully and includes the new test(s).

## Required Test Commands

```bash
npm run build
npm run lint
npm run test
```
