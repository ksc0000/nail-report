```markdown
# Worker Prompt Template

## Context

The current phase is 2.0 (Improving stability, test coverage, and UX). The immediate focus is on increasing test coverage, starting with core utility functions. Vitest is the chosen test runner, and Firebase SDK mocking is a specified requirement for unit tests.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking the Firebase SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (for understanding functions, no functional changes expected unless absolutely required for testability with a clear justification)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `src/setupTests.ts` (if a global test setup for Firebase mocking is desired, though `vi.mock` can be done per test file)
-   `vite.config.ts` (minimal changes if Vitest configuration for mocking paths is needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any UI components or CSS files

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add tests for the `src/lib/firestore.ts` file.
-   Mock the Firebase Firestore SDK using `vi.mock` to ensure tests are isolated unit tests, not integration tests.
-   Cover common CRUD operations (add, get, update, delete) and basic error handling within the `firestore.ts` functions.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to add unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK:** Utilize `vi.mock` to mock the necessary Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Ensure the mocks allow you to control the return values and simulate successful and failed operations.
3.  **Test `getNailItems`:**
    *   Write a test case to ensure it correctly fetches and transforms a list of nail items.
    *   Write a test case for when the collection is empty.
    *   Write a test case that simulates an error during data fetching.
4.  **Test `addNailItem`:**
    *   Write a test case to ensure it correctly adds a new nail item and returns the expected ID.
    *   Write a test case that simulates an error during item addition.
5.  **Test `updateNailItem`:**
    *   Write a test case to ensure it correctly updates an existing nail item.
    *   Write a test case that simulates an error during item update.
6.  **Test `deleteNailItem`:**
    *   Write a test case to ensure it correctly deletes a nail item.
    *   Write a test case that simulates an error during item deletion.
7.  **Run tests:** Execute `npm test` to confirm your tests pass.
8.  **Lint and Build:** Ensure `npm run build && npm run lint` pass without errors or warnings.
```
