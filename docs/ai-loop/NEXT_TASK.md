# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that test coverage is a priority. This task will initiate the test coverage efforts by targeting core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK interactions to test the logic of functions that handle Firestore CRUD operations (e.g., adding, updating, deleting, and fetching nail items).

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if necessary for testability, but the primary goal is to add tests)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only if absolutely necessary for Vitest configuration related to Firebase mocking, but prefer to assume base setup is complete)
-   `package.json` (only to add a test script if missing, but `npm test` should ideally already be configured for Vitest)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (do NOT add new npm packages; Vitest is assumed to be configured)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Use `vi.mock` to mock Firebase SDK functions (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`) to isolate the `firestore.ts` logic.
-   Ensure tests cover at least the main CRUD operations for nail items handled by `src/lib/firestore.ts`.
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` and ensure all new tests pass.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
