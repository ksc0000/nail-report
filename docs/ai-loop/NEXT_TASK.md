# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines improving stability, test coverage, and UX in Phase 2. This task focuses on beginning to establish unit test coverage. Vitest is already configured as the test runner.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. The initial focus should be on one or two simpler, pure functions or those that perform straightforward Firestore operations.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least one function in `src/lib/firestore.ts`.
-   Use Vitest for testing and mock Firebase SDK dependencies as needed.
-   Ensure tests are focused and atomic.
-   Keep the diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
