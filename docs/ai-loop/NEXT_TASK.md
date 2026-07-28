# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. A key initial step is to enhance test coverage for core utility functions. This task specifically targets adding unit tests for the Firebase Firestore helper functions.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, focusing on a few simple, isolated functions to keep the PR small.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes might be needed to improve testability, but focus on adding tests)
-   `src/__tests__/` (for new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `vite.config.ts` (only if absolutely necessary for Vitest configuration, but assume Vitest is already set up)
-   `package.json` (only to add a `test` script if not already present, do NOT add new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files not explicitly listed in "Allowed Scope"

## Requirements

-   **Focus**: Add unit tests for 2-3 simple, isolated helper functions within `src/lib/firestore.ts`. Examples might include data mapping/conversion functions or simple data preparation utilities. Avoid functions requiring complex Firebase SDK mocking for this initial task.
-   **Test Framework**: Use Vitest for writing tests.
-   **Mocking**: Employ `vi.mock` for any necessary Firebase SDK dependencies or external services to ensure tests are truly "unit" tests.
-   **Code Quality**: Ensure tests are clear, readable, and cover typical inputs and edge cases for the chosen functions.
-   **PR Size**: Keep the overall diff for this task at or below 150 lines.
-   **Verification**: Run `npm run build`, `npm run lint`, and `npm test` successfully before finishing the task.
-   **Output**: Report the summary of changes, list of changed files, command outputs, known issues, and suggested next task.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
