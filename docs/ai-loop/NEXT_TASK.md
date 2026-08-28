# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

## Worker prompt

Your task is to add Vitest unit tests for the Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Set up mocks for the necessary `firebase/firestore` functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `limit`, `getDoc`) using `vi.mock`. You will need to simulate their behavior, returning mock data or successful/failed promises as appropriate for each test case.
3.  **Write Unit Tests:** Implement unit tests for the core CRUD operations and other helper functions within `src/lib/firestore.ts`, including but not limited to:
    *   `addNailItem`
    *   `getNailItems`
    *   `getNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getMonthlyNailItemsCount`
    *   `getNailItemTags`
4.  **Cover success and error paths:** For functions that can fail (e.g., due to Firebase errors), ensure you have tests that cover both successful execution and expected error handling (though the current functions might just throw, which is fine to test).
5.  **Focus on isolation:** Ensure tests for `src/lib/firestore.ts` functions only test the logic within that file and mock all external dependencies (Firebase SDK).

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   `src/lib/firestore.ts` (minor adjustments if needed for testability, but avoid logic changes)
-   `src/__tests__/` (new test files)
-   `vite.config.ts` (only if Vitest config needs adjustment, but unlikely)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` is created.
-   The tests utilize Vitest's mocking capabilities for the Firebase Firestore SDK.
-   Unit tests cover the `addNailItem`, `getNailItems`, `getNailItem`, `updateNailItem`, `deleteNailItem`, `getMonthlyNailItemsCount`, and `getNailItemTags` functions in `src/lib/firestore.ts`.
-   All newly added tests pass successfully.
-   The changes adhere to the diff size limit.

## Required Test Commands

```bash
npm test # To run the new unit tests
npm run build && npm run lint
```
