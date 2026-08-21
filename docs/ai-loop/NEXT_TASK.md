# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions. The current task is to implement the first substantive item from the "Jules-ready Tasks" list.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. These tests should demonstrate the correct interaction with mocked Firebase Firestore SDK functions, aligning with the roadmap's goal of mocking the Firebase SDK using `vitest + vi.mock`.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor adjustments to enable testability, if necessary)
-   `src/__tests__/` (e.g., creating a new file like `src/__tests__/firestore.test.ts`)
-   `package.json` (only to confirm `vitest` is a dev dependency, do not add new dependencies)

## Forbidden Scope

-   `src/main.tsx`
-   `commands/`
-   `firestore.rules`, `storage.rules`
-   Adding new npm packages to `dependencies` or `devDependencies` if `vitest` is not already present. (Assume `vitest` is already configured or can be used without *adding* it as a *new* dependency).
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file (e.g., `src/__tests__/firestore.test.ts`).
-   Implement at least 2-3 unit tests for different functions within `src/lib/firestore.ts`. Examples might include functions related to adding, getting, or updating nail items or public shares.
-   Ensure the tests effectively mock Firebase Firestore SDK interactions using `vi.mock`.
-   Keep the total diff size (including new test files and any minor changes to `firestore.ts`) ≤ 150 lines.
-   Run `npm run build && npm run lint && npm test` (or `npm run vitest` if configured) before finishing.
-   If `vitest` is not configured or installed, report this as a known issue/limitation.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
