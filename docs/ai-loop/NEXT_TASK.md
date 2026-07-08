# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first priority in this phase is to increase test coverage, starting with core utility functions.

## Objective

Implement unit tests for the functions within `src/lib/firestore.ts` using Vitest. Focus on ensuring the helper functions for interacting with the `nailItems` Firestore collection are robust and behave as expected.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor modifications if needed to expose functions for testing, e.g., named exports)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only if Vitest setup is strictly required, e.g., adding `globals: true` or `setupFiles`)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Use Vitest for testing and `vi.mock` to mock the Firebase Firestore SDK methods (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
-   Write tests for at least two key CRUD operations related to `nailItems` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
-   Ensure tests cover successful execution paths.
-   Prefer adding named exports to `src/lib/firestore.ts` if needed to make functions testable, rather than altering their core logic.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Jules, your task is to add unit tests for `src/lib/firestore.ts`.

1.  Create a new file: `src/__tests__/firestore.test.ts`.
2.  In `src/__tests__/firestore.test.ts`, write unit tests for at least two functions from `src/lib/firestore.ts` that interact with the `nailItems` Firestore collection.
    *   Examples include `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
3.  Use `vi.mock` to mock the Firebase Firestore SDK functions (`getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to simulate Firestore interactions without actually hitting the database.
4.  Ensure your tests cover the successful execution path for the chosen functions.
5.  If any function in `src/lib/firestore.ts` is not exported, add a `export` keyword to make it accessible for testing, but do not change its logic or external behavior.
6.  Verify that `npm run test` passes after your changes.
7.  Ensure the total diff size for your changes remains within 150 lines.

**Acceptance Criteria:**
-   `src/__tests__/firestore.test.ts` exists and contains unit tests for at least two functions from `src/lib/firestore.ts`.
-   Firebase Firestore SDK is mocked using `vi.mock`.
-   Tests pass when running `npm run test`.
-   `npm run build` and `npm run lint` execute without errors or warnings.
