# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current state indicates that the first substantive product task is pending. This task will initiate the test coverage efforts by adding unit tests for a core Firebase helper module.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This involves setting up mocked Firebase SDK interactions and creating a new test file to ensure the data access layer functions as expected.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions or add testable logic if needed, but primarily tested)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `vite.config.ts` (minor modifications for Vitest setup if absolutely necessary, but assume Vitest is largely configured)
-   `package.json` (only if adding a `test` script or similar, no new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any UI components or `src/App.tsx`
-   `src/lib/storage.ts`, `src/lib/auth.ts`, `src/lib/publicShares.ts` (out of scope for *this* task)

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add a new test file `src/__tests__/firestore.test.ts`.
-   Use Vitest for unit testing.
-   Mock Firebase Firestore SDK interactions (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`) to test `firestore.ts` functions in isolation.
-   Cover common CRUD operations present in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItem`, `getNailItems`, `addPublicShare`, `deletePublicShare`, `getPublicShare`).
-   Tests should verify correct arguments are passed to mocked Firebase functions and that expected values are returned or errors are handled.
-   Do NOT add new `npm` dependencies. Assume `vitest` is already available as a dev dependency.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
