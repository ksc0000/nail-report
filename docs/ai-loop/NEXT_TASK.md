# Worker Prompt Template

## Context

The product roadmap for `nail-report` is currently in Phase 2, focusing on improving stability, test coverage, and UX. A key aspect of Phase 2.1 is enhancing test coverage, specifically by adding unit tests for core helper functions and utilizing Vitest for this purpose, including mocking the Firebase SDK.

## Objective

Add comprehensive unit tests for the helper functions defined in `src/lib/firestore.ts`. This involves creating a new test file, identifying testable functions within `firestore.ts`, and implementing tests using Vitest, ensuring that interactions with the Firebase SDK are properly mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (to understand functions to test, minor refactoring for testability is acceptable but avoid significant logic changes)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `vite.config.ts` (only for minimal Vitest configuration if absolutely necessary, but assume Vitest is largely configured)
-   `package.json` (only to ensure a `test` script exists, *not* to add new npm dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Ensure Firebase SDK calls within `firestore.ts` are mocked in the tests to provide true unit isolation.
-   Cover at least 2-3 key helper functions with tests.
-   Verify that Vitest is runnable via `npm run test` (or similar configured command).

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---
**Worker prompt**: Add unit tests for the helper functions in `src/lib/firestore.ts`. Assume Vitest is already configured and available to use. Create a new test file `src/__tests__/firestore.test.ts`. Focus on mocking Firebase SDK interactions to test the business logic within the helper functions.
