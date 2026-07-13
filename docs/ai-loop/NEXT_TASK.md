# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by adding unit tests for Firebase helper functions. Vitest is the designated test runner.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` functions within `src/lib/firestore.ts` using Vitest. This involves mocking Firebase SDK dependencies to isolate the functions under test.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a test file)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `vite.config.ts` (minimal configuration for Vitest if absolutely necessary and within line limits, but assume Vitest is generally configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Modifying `src/App.css` or other UI-related files

## Requirements

-   Create a new test file, `src/__tests__/firestore.test.ts`.
-   Write unit tests for `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
-   Mock Firebase SDK interactions (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
-   Ensure tests cover successful execution and basic error cases for the targeted functions.
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` to verify the new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
