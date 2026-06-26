# Worker Prompt Template

## Context

The `nail-report` application needs improved test coverage, starting with core Firebase helper functions. `src/lib/firestore.ts` contains crucial functions for interacting with the Firestore database. Vitest is the chosen test runner for the project.

## Objective

Add unit tests for the `getNailItems` and `addNailItem` helper functions within `src/lib/firestore.ts`. These tests should verify their correct interaction with the Firestore SDK, using mock implementations where necessary to isolate logic.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting internal functions)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `package.json` (only if Vitest or testing utilities are missing from `devDependencies`, but *only* if adding *existing* packages, not new ones. *Prefer to assume Vitest is already installed*.)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no *new* npm packages that are not already present in `node_modules` without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any file not explicitly mentioned in "Allowed Scope"

## Requirements

-   Create a new test file `src/__tests__/lib/firestore.test.ts`.
-   Write unit tests for `getNailItems` and `addNailItem` functions from `src/lib/firestore.ts`.
-   Mock Firebase SDK interactions (e.g., `firebase/firestore` functions) using `vi.mock` to ensure tests are isolated and do not require a live Firebase connection.
-   Ensure tests cover successful operations and potential error paths for these functions.
-   Keep the total diff for this PR ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments in the PR, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
