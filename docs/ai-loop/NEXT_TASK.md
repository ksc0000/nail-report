# Worker Prompt Template

## Context

The `nail-report` application is moving into Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus initially on the CRUD operations for `nailItems`. This involves mocking the Firebase Firestore SDK to ensure tests are isolated and fast.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors for testability)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/lib/` (any new mock files if necessary)
-   `vite.config.ts` (minimal changes for test setup if Vitest is not fully configured yet, e.g., adding test environment)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval; Vitest is assumed to be available)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Write tests for at least the `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
-   Mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and do not interact with a live Firebase project.
-   Ensure tests cover successful operations and basic error handling where applicable (e.g., promises rejecting).
-   Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
