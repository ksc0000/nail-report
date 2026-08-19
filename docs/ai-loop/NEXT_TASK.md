```markdown
# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, with a strong focus on improving stability and test coverage. This task aims to kickstart the unit testing efforts for core utility functions, specifically targeting Firebase Firestore helpers. Establishing a clear pattern for testing with Vitest and mocking the Firebase SDK is a key goal.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` to improve test coverage and demonstrate the use of Vitest with Firebase SDK mocking, as outlined in Phase 2.1 of the roadmap.

## Allowed Scope

-   `src/lib/firestore.ts` (Minor adjustments for testability, e.g., exporting non-exported functions if necessary, but avoid altering existing logic)
-   `src/__tests__/lib/firestore.test.ts` (New test file)
-   `src/__tests__/` (New subdirectories or files within this directory if logically required for mocks, e.g., `src/__tests__/__mocks__/firebase.ts`)
-   `vite.config.ts` (Only if essential to configure Vitest for Firebase SDK mocking, e.g., alias or mock path resolution. Prioritize `vi.mock` directly in test files.)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except `vite.config.ts` if absolutely necessary as per Allowed Scope.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Your task is to create a new test file, `src/__tests__/lib/firestore.test.ts`, and implement unit tests for one or two clearly bounded helper functions within `src/lib/firestore.ts`.

**Specific steps:**

1.  Create the file `src/__tests__/lib/firestore.test.ts`.
2.  Identify one or two suitable helper functions in `src/lib/firestore.ts` that encapsulate specific logic (e.g., data conversion, query construction, or simple CRUD wrappers). Examples could be functions that map Firestore document snapshots to application-specific objects, or functions that prepare data for Firestore writes.
3.  Write unit tests for these selected functions using Vitest.
4.  Crucially, mock any Firebase SDK dependencies (e.g., `firebase/firestore` functions like `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `query`, `onSnapshot`) using `vi.mock` to ensure tests are isolated and don't interact with a live Firebase project.
5.  Focus on testing the logic of your selected functions, ensuring edge cases (e.g., empty data, null values if applicable) are considered.
6.  Ensure the tests are clear, readable, and provide a good example for future unit tests within the project.
7.  Verify that `npm run test` can successfully execute your new tests.

**Example scenario for a target function:** If `src/lib/firestore.ts` has a function `convertFirestoreDocToNailItem(docSnapshot: DocumentSnapshot)` that transforms a Firestore document snapshot into a `NailItem` object, this would be an excellent candidate for testing. You would mock `docSnapshot.data()` and `docSnapshot.id`.

Remember to adhere to the line diff limit. Focus on getting the mocking pattern and a few good tests in place, rather than comprehensive coverage of the entire file in this single PR.

```
