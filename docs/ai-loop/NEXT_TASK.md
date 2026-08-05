# Worker Prompt Template

## Context

The current phase of development is focused on improving stability, test coverage, and UX. A key part of this is adding comprehensive unit tests for core helper functions.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest. This task focuses on establishing initial test coverage for the Firestore helper functions, including mocking the Firebase SDK as necessary.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if needed for testability, but primary focus is on testing existing logic)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (for adding `vitest` script if not already present, but *no new npm dependencies*)
-   `vite.config.ts` (for Vitest configuration, if necessary)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` `dependencies` or `devDependencies` (no new npm packages without human approval, *except* for `vitest` setup if not already configured in `scripts`)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Add tests for the primary CRUD helper functions exported from `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or similar).
-   Mock the Firebase Firestore SDK methods (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) using `vi.mock` to ensure tests are isolated and do not interact with a real Firebase project.
-   Ensure at least one test case is implemented for each major helper function in `firestore.ts`.
-   Keep the diff size ≤ 150 lines.
-   Run `npm run build && npm run lint` and `npm test` successfully before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
