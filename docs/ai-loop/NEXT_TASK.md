```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates that Vitest has been selected as the test runner. This task focuses on beginning the unit test coverage for the `src/lib/` helper functions.

## Objective

Add unit tests for at least two helper functions within `src/lib/firestore.ts` using Vitest, specifically mocking Firebase SDK interactions.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `src/setupTests.ts` (if needed for global Vitest setup, but prefer local mocks)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for the `vitest.config.ts` if absolutely necessary for minimal setup, but prioritize keeping test config localized.

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Implement unit tests for at least two core helper functions in `src/lib/firestore.ts`. Examples include `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
-   Effectively mock Firebase SDK (Firestore) calls using `vi.mock` to isolate the logic being tested.
-   Ensure the tests are isolated, deterministic, and pass.
-   Keep the diff for the entire PR at or below 150 lines.
-   Run `npm run build && npm run lint` to ensure no build errors or linting issues.
-   Run `npm run test` to confirm tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
