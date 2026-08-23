```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase interactions.

## Objective

Implement unit tests for selected helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on basic CRUD operations.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications if needed for testability, e.g., exporting non-exported functions, but primarily for understanding what to test)
-   `src/__tests__/firestore.test.ts` (new file)
-   `src/setupTests.ts` (if global Vitest setup/mocks are needed, or similar test utility files)
-   `vite.config.ts` (minor modifications for Vitest configuration, if necessary)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for `vite.config.ts`

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Mock the Firebase Firestore SDK using `vi.mock` to isolate tests from actual Firebase calls.
-   Write at least two unit tests for helper functions within `src/lib/firestore.ts`. Good candidates include `addNailItem` and `getNailItems` or similar basic item creation/retrieval functions, ensuring they handle success cases.
-   The tests should verify that the correct Firestore methods are called with the expected arguments.
-   Ensure existing functionality of `src/lib/firestore.ts` is not broken.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
