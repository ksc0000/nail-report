# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically addresses the "Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on a few key functions to keep the PR small.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability, e.g., exporting non-default functions)
-   `src/__tests__/firestore.test.ts` (new test file)
-   `vitest.config.ts` (only if absolutely necessary for mocking configuration, otherwise avoid)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except `vitest.config.ts` if specified above.

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Implement unit tests for at least 2-3 core Firestore helper functions from `src/lib/firestore.ts` (e.g., `addItem`, `updateItem`, `deleteItem`, `getNailItems`).
-   Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vitest`'s mocking capabilities to isolate the functions under test.
-   Ensure tests cover both successful operations and potential error scenarios if applicable and easily testable without complex mocks.
-   Keep the diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
