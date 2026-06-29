# Worker Prompt Template

## Context

The current phase (Phase 2) of the roadmap focuses on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding foundational unit tests for Firebase Firestore helper functions.

## Objective

Implement unit tests for key exported helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactoring for testability if strictly necessary, but prefer to only write tests)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/lib/auth.ts`, `src/lib/storage.ts` (only if necessary for mocking purposes, but not to add tests themselves)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Identify and implement unit tests for at least 2-3 key exported helper functions within `src/lib/firestore.ts`. Focus on functions that interact with the Firestore SDK directly or perform data transformations.
-   Use `vitest` and `vi.mock` to mock Firebase SDK dependencies appropriately.
-   Ensure tests cover typical successful execution paths and at least one error case per tested function, if applicable.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
