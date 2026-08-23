# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by starting to add unit tests for Firebase helper functions. The current state indicates that test coverage for `src/lib/firestore.ts` is a high priority and no tests for it currently exist.

## Objective

Add Vitest unit tests for the `addNailItem` and `getNailItems` functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors to improve testability)
-   `src/__tests__/firestore.test.ts` (new test file)
-   `vite.config.ts` (minor additions for Vitest setup if absolutely necessary, but generally should be pre-configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for `vite.config.ts` for Vitest config if necessary.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Implement unit tests for `addNailItem` and `getNailItems` functions from `src/lib/firestore.ts`.
-   Mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `query`, `orderBy`, `onSnapshot`, `setDoc`, `deleteDoc`) using `vitest.mock` or `vi.mock` to simulate Firebase behavior without making actual network calls.
-   Tests should verify that the correct Firebase SDK methods are called with the expected arguments.
-   Focus on happy-path scenarios for `addNailItem` and `getNailItems`. Error handling tests can be added in a subsequent task.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to implement unit tests for two specific helper functions in `src/lib/firestore.ts`: `addNailItem` and `getNailItems`.

Here's a step-by-step guide:

1.  **Create a New Test File:**
    *   Create `src/__tests__/firestore.test.ts`.

2.  **Mock Firebase Firestore SDK:**
    *   Inside `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the necessary Firebase Firestore functions. You will need to mock `firebase/firestore` to control the behavior of `addDoc`, `getDocs`, `collection`, `query`, `orderBy`, etc.
    *   The mock should allow you to assert that these functions are called with the correct arguments and to define their return values (e.g., `addDoc` returning a mock `DocumentReference`, `getDocs` returning a mock `QuerySnapshot`).

3.  **Implement Tests for `addNailItem`:**
    *   Write a test case that calls `addNailItem` with valid data and a user ID.
    *   Assert that `addDoc` (or its equivalent in your mock setup) is called exactly once with the expected `collection` path and the provided `itemData`.
    *   Verify that the returned value from `addNailItem` matches what your mock for `addDoc` would return.

4.  **Implement Tests for `getNailItems`:**
    *   Write a test case that calls `getNailItems` with a user ID.
    *   Set up your Firebase mock to return a predefined array of mock `QueryDocumentSnapshot` objects when `getDocs` is called.
    *   Assert that `collection`, `query`, `orderBy` (if used in `getNailItems`), and `getDocs` are called with the expected parameters.
    *   Assert that the `getNailItems` function correctly transforms and returns the mocked data.

5.  **Run Tests and Linters:**
    *   Execute `npm run test` to ensure your new tests pass.
    *   Run `npm run build && npm run lint` to confirm no build or linting errors are introduced.

Remember to keep the diff small and focused only on `addNailItem` and `getNailItems`. Do not implement tests for other functions in `src/lib/firestore.ts` in this task.
