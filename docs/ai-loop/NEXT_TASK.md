# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2 is active, with a focus on improving stability, test coverage, and UX. This task specifically addresses "2.1 Test coverage" by adding unit tests for core Firebase Firestore helper functions. Vitest is the chosen test runner for the project.

## Objective

Add unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions or add types if necessary for testing)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `src/setupTests.ts` (if needed for global test setup, e.g., Vitest globals)
-   `package.json` (only to add or modify test scripts if `vitest` is already a dev dependency, but *not* to add new npm dependencies).

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` (do not add new npm packages/dependencies; Vitest should be assumed as an existing dev dependency)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add tests for the core CRUD and helper functions in `src/lib/firestore.ts`.
-   Use `vi.mock` to mock Firebase Firestore SDK interactions (`firebase/firestore`).
-   Tests should cover successful operations and basic error handling where applicable.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

## Worker Prompt

1.  **Create a Test File:** Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Vitest Setup and Mocks:**
    *   Configure Vitest to run these tests. Assume Vitest is already installed as a dev dependency.
    *   Implement mocks for the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `limit`). The goal is to isolate the logic within `src/lib/firestore.ts` from actual Firebase calls.
    *   Mock Firebase Auth SDK if `firestore.ts` depends on `getAuth` or `onAuthStateChanged` directly for user ID.
3.  **Implement Unit Tests for `src/lib/firestore.ts` functions:**
    *   **Focus on core CRUD operations:**
        *   `addNailItem`: Test that it calls `addDoc` with the correct collection path and data, and returns the expected result.
        *   `getNailItems`: Test that it queries the `nailItems` collection with appropriate filters/orders and correctly transforms the Firestore snapshot into the expected data structure. Include tests for empty results.
        *   `getNailItem`: Test that it calls `getDoc` with the correct document ID and returns the item or `null` if not found.
        *   `updateNailItem`: Test that it calls `updateDoc` with the correct document ID and data.
        *   `deleteNailItem`: Test that it calls `deleteDoc` with the correct document ID.
    *   **Public Share functions (if present in `firestore.ts`):**
        *   `addPublicShare`, `updatePublicShare`, `deletePublicShare` (or similarly named functions): Apply the same principles as above to ensure correct interactions with the `publicShares` collection.
    *   **Error Handling:** Add basic tests to ensure that promises reject correctly when the underlying Firebase mock operations throw errors.
4.  **Verification:**
    *   Run your tests using `npm test` or the appropriate Vitest command.
    *   Ensure `npm run build` and `npm run lint` pass without errors or warnings.
