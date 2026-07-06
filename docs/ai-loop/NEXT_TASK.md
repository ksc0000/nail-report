# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 focuses on improving test coverage. The current state shows no unit tests for the `firestore.ts` helper functions yet.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions or add test IDs if necessary for testing, but prioritize testing existing public interfaces)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/lib/firestore.ts` and `src/__tests__/`

## Requirements

-   Keep diff ≤ 150 lines.
-   Add a new test file, `src/__tests__/firestore.test.ts`.
-   Cover the main helper functions in `src/lib/firestore.ts` with unit tests (e.g., functions for creating, reading, updating, deleting nail items or public shares if they reside there).
-   Use `vitest` and mock Firebase SDK dependencies where necessary to ensure tests are isolated and run quickly.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
