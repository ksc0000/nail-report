# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 aims to enhance test coverage for core utility functions. This task is the first substantive step towards unit testing the application's Firebase interactions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, focusing on effective mocking of the Firebase SDK to ensure isolated testing.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor refactoring to improve testability, if strictly necessary)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `vite.config.ts` (only if Vitest configuration for test file discovery needs adjustment, otherwise avoid)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of the explicitly allowed scope.

## Requirements

-   Create a new test file, `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, or functions involving Firestore queries).
-   Utilize Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to ensure tests run in isolation without actual Firebase calls.
-   Ensure tests cover typical success cases and basic error handling scenarios.
-   Keep the diff size to a maximum of 150 lines.
-   Run `npm run build` and `npm run lint` before finishing to ensure code quality and build integrity.
-   Run `npm test` to verify the new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
