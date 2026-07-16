# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task specifically targets "2.1 Test coverage" by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the `addItem` and `getItem` functions within `src/lib/firestore.ts` using Vitest. This should include mocking Firebase SDK calls to ensure tests are isolated and fast.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactoring to improve testability if necessary, but keep changes minimal)
-   `src/__tests__/lib/firestore.test.ts` (new test file)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any file outside the `src/` directory, except `vitest.config.ts` if absolutely essential for basic test setup (though it should be pre-configured).

## Requirements

-   Keep diff ≤ 150 lines.
-   Add a new test file `src/__tests__/lib/firestore.test.ts`.
-   Write tests that cover successful execution of `addItem` and `getItem`.
-   Mock Firebase SDK methods (e.g., `getFirestore`, `collection`, `addDoc`, `getDoc`, `doc`) to prevent actual Firebase calls during tests.
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` and ensure all new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
