# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines Phase 2, which focuses on improving stability, test coverage, and UX. Specifically, objective 2.1 aims to increase test coverage, including unit tests for Firestore helper functions in `src/lib/firestore.ts` and mocking the Firebase SDK using Vitest.

This task is the first substantive task in Phase 2, directly addressing the test coverage objective.

## Objective

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This involves creating a new test file, identifying the public helper functions, and writing test cases for each, ensuring Firebase SDK calls are appropriately mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if necessary for testing)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/__tests__/` (other new test files as needed for mocking setup, e.g., `src/__mocks__/firebase.ts` if a separate mock file is preferred)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Modifying any other files outside the `Allowed Scope`.

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Identify all public helper functions within `src/lib/firestore.ts` that interact with Firestore.
-   Write unit tests for each identified helper function.
-   Ensure Firebase Firestore SDK interactions are mocked effectively using `vi.mock()` as described in the roadmap (Phase 2.1). Focus on testing the logic within the `firestore.ts` helpers, not the Firebase SDK itself.
-   Aim for good test coverage for the functions in `src/lib/firestore.ts`.
-   Keep the overall diff for the pull request at or below 150 lines.
-   Run `npm run build && npm run lint` successfully before finishing the task.
-   Report any follow-up items or identified limitations as comments in the PR description, not by adding additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
