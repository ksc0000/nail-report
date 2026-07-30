# Worker Prompt Template

## Context

The nail-report application needs improved test coverage, starting with the core utility functions that interact with Firebase Firestore. This task focuses on adding unit tests for `src/lib/firestore.ts` using Vitest.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`. This will involve configuring Vitest to mock Firebase Firestore SDK methods to allow for isolated testing of our custom logic.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (for Vitest configuration, if needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Add unit tests for at least the `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, and `subscribeToNailItems` functions in `src/lib/firestore.ts`.
-   Use `vitest` and `vi.mock` to mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`) to ensure tests are isolated and do not interact with a live Firebase project.
-   Ensure all newly added tests pass.
-   Keep the total diff for this PR under 150 lines.
-   Run `npm run build && npm run lint` before finishing and ensure no errors or warnings are reported.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
