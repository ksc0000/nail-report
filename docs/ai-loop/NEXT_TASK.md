# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines a focus on improving stability and test coverage in Phase 2. This task focuses on establishing unit tests for the core Firebase Firestore helper functions, which are critical for data management.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. The tests should mock Firebase SDK dependencies to ensure unit isolation.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability if necessary, but focus on testing existing logic)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/__mocks__/firebase-firestore.ts` (new file for mocking, if needed)
-   `vite.config.ts` (only if absolutely necessary for Vitest configuration, prefer to avoid)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Implement mocking for Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`) using `vitest.mock`.
-   Write at least one unit test for each of the following functions in `src/lib/firestore.ts`:
    -   `addNailItem`
    -   `getNailItems`
    -   `updateNailItem`
    -   `deleteNailItem`
-   Ensure tests cover successful operations and, ideally, basic error scenarios (e.g., a rejected promise from a Firebase call).
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` to verify the new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
