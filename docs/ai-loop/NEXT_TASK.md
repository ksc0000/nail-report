# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The first goal in this phase is to add unit tests, starting with helper functions. This task directly addresses the "2.1 Test coverage" objective.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK (Firestore).

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, or minor fixes)
-   `src/__tests__/firestore.test.ts` (new test file)
-   `vite.config.ts` (only for Vitest configuration, if needed to mock Firebase)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside `src/` except for `vite.config.ts`.

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Use `vitest` for testing.
-   Mock the Firebase SDK, specifically Firestore, to avoid actual database calls during tests.
-   Write unit tests for at least `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
-   Ensure tests cover successful execution and basic error cases (e.g., rejection of a promise).
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
