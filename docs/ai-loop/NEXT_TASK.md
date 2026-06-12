# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the "Test coverage" goal by adding unit tests for core Firebase Firestore helper functions. Vitest is already configured for the project.

## Objective

Implement unit tests for the `src/lib/firestore.ts` helper functions, specifically targeting `addNailItem` and `getNailItems`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but prefer not to)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `package.json` (only for adding a test script if not already present, but Vitest should be set up)
-   `vite.config.ts` (only for Vitest configuration, if necessary for mocks)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`
-   Any files outside of `src/lib/firestore.ts`, `src/__tests__/lib/firestore.test.ts`, and `vite.config.ts` (for Vitest config if necessary).

## Requirements

-   Create a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Write unit tests for `addNailItem` and `getNailItems` in `src/lib/firestore.ts`.
-   Utilize Vitest's mocking capabilities to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
-   Ensure tests cover successful operations and basic error handling for these functions.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm test` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
