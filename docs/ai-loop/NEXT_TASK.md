# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and user experience. This task addresses the "Test coverage" objective by adding initial unit tests for Firebase helper functions. Vitest is the chosen test runner for the project.

## Objective

Implement initial unit tests for key Firestore helper functions within `src/lib/firestore.ts` using Vitest. Focus specifically on `getNailItems` and `addNailItem` (or similarly fundamental functions for fetching and creating items if these exact names do not exist) to establish a testing baseline.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for export if necessary)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `src/__tests__/lib/__mocks__/firebase.ts` (new file for Firebase SDK mocks, if needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (do not add new npm packages; assume `vitest` is already installed as a dev dependency)
-   Firebase deploy commands
-   Secrets and credentials
-   `vite.config.ts` (assume Vitest is already configured)

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file `src/__tests__/lib/firestore.test.ts`.
-   Mock the Firebase SDK (specifically Firestore methods) using `vitest`'s mocking capabilities to isolate the `firestore.ts` functions from actual Firebase calls.
-   Write unit tests for at least two core functions in `src/lib/firestore.ts`, such as `getNailItems` and `addNailItem`, covering basic success scenarios.
-   Run `npm run build && npm run lint` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---
**Note to Jules:** This task assumes `vitest` is already configured and installed as a dev dependency. If `vitest` is not available, please report an error, and the human will address the setup.
