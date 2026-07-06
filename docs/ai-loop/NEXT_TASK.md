# Worker Prompt Template

## Context

The product roadmap indicates "Phase 2 - Active" focuses on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" goal by adding initial unit tests for key Firestore helper functions.

## Objective

Add initial unit tests for core helper functions within `src/lib/firestore.ts` using Vitest, ensuring Firebase SDK interactions are properly mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (for understanding function signatures)
-   `src/__tests__/firestore.test.ts` (new test file)
-   Any necessary Vitest configuration files if they are explicitly for test setup (e.g., `vitest.config.ts`), but do not add new npm dependencies to `package.json`.

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Adding Vitest as a new dependency if it's not already configured (assume Vitest is ready to be used).

## Requirements

-   Keep diff ≤ 150 lines. Focus on testing 1-2 core CRUD operations (e.g., `addItem`, `updateItem`, `deleteItem`, or `getNailItems`).
-   Use `vitest` for writing tests.
-   Properly mock Firebase SDK functions (Firestore specifically) to isolate the `firestore.ts` logic.
-   Ensure tests cover typical success cases and basic error handling where applicable for the chosen functions.
-   Run `npm run build && npm run lint && npm run test` (or equivalent test command) before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
