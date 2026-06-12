# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. This task contributes to improving test coverage for core Firebase helper functions. Vitest is already identified as the test runner.

## Objective

Add Vitest unit tests for the helper functions implemented in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor adjustments if needed to enable testing, e.g., exporting non-exported helpers)
-   `src/__tests__/firestore.test.ts` (or a similar new test file for `firestore` helpers)
-   `src/` (other existing files may be imported into tests as needed, but not modified)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file, for example, `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least two significant helper functions within `src/lib/firestore.ts`. Focus on testing their core logic and interactions with mock Firebase SDK calls.
-   Utilize Vitest for testing. Firebase SDK interactions should be mocked.
-   Ensure the tests cover happy paths and basic error handling where applicable to the helper function's responsibilities.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`)
