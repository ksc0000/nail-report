# Worker Prompt Template

## Context

The application needs improved stability and test coverage as outlined in Phase 2.1 of the roadmap. This task initiates unit testing for core Firebase helper functions by targeting `src/lib/firestore.ts`. Vitest is specified as the test runner and is expected to be already configured and installed as a dev dependency.

## Objective

Implement Vitest unit tests for the `addNailItem` helper function within `src/lib/firestore.ts`. This involves creating a new test file and mocking Firebase Firestore SDK methods to isolate the function under test.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors for testability)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages, Vitest is assumed to be installed)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Create a new test file:** In the `src/__tests__/` directory, create a new file named `firestore.test.ts`.
2.  **Set up Vitest environment:**
    *   Import necessary functions from `vitest`.
    *   Mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `addDoc`, `doc`, `setDoc`, `getDoc` as needed) to prevent actual database calls during tests. Focus on mocking `addDoc` and `collection` for the `addNailItem` function. A common pattern is to mock the entire `firebase/firestore` module or specific functions.
3.  **Write a test suite for `addNailItem`:**
    *   Use `describe` to group tests for `addNailItem`.
    *   Write an `it` block to test a successful `addNailItem` call.
    *   Call `addNailItem` with some dummy data.
    *   Assert that the mocked `addDoc` function was called with the correct `collection` reference and payload.
    *   Assert that `addNailItem` returns the expected value (e.g., the document ID or a success indicator).
4.  **Ensure mocks are reset:** Use `beforeEach` or `afterEach` as appropriate to clear mocks between tests if necessary, though for a single function test, it might not be strictly required initially.

**Acceptance Criteria:**

-   A new file `src/__tests__/firestore.test.ts` is created.
-   The file contains a passing Vitest unit test for the `addNailItem` function from `src/lib/firestore.ts`.
-   The Firebase Firestore SDK is appropriately mocked, preventing real database interactions.
-   `npm run test` executes successfully and shows the new test passing.

**Required Test Commands:**

```bash
npm run test
npm run build && npm run lint
```

**Known Issues or Limitations:**

-   This task only covers `addNailItem`. Other functions in `src/lib/firestore.ts` will require separate testing tasks.
-   The mocking setup for Firebase Firestore might be basic; it can be refined in future tasks for more complex scenarios.

**Suggested Next Task:**

Add Vitest unit tests for another helper function in `src/lib/firestore.ts`, such as `getNailItems`.
