# Worker Prompt Template

## Context

The application needs robust test coverage for its core logic, starting with Firebase interactions. Vitest has been chosen as the test runner for unit tests. This task focuses on setting up Vitest and writing initial tests for the Firestore helper functions.

## Objective

Initialize Vitest in the project and implement unit tests for the functions defined in `src/lib/firestore.ts`.

## Allowed Scope

-   `package.json` (to add `vitest` and related dev dependencies, and a test script)
-   `vitest.config.ts` (new file for Vitest configuration)
-   `src/lib/firestore.ts` (for minor refactors to improve testability, if strictly necessary)
-   `src/__tests__/firestore.test.ts` (new file for Firestore unit tests)
-   `src/` (except `src/main.tsx`)
-   `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
-   `src/__tests__/` (new test files)
-   `src/App.css` (CSS improvements)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Install `vitest` and `@vitest/coverage-v8` as dev dependencies.
-   Create and configure `vitest.config.ts` for the project.
-   Add a `test` script to `package.json` to run Vitest.
-   Write comprehensive unit tests for the helper functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
-   Use Vitest's mocking capabilities to mock the Firebase SDK (e.g., `firebase/firestore`, `firebase/app`) to ensure tests are isolated and do not interact with actual Firebase services.
-   Ensure tests cover successful operations and relevant error paths.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
