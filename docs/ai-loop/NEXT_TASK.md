# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses the "Test coverage" goal. Vitest is designated as the test runner, and Firebase SDK mocking using `vi.mock` is a key technique.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`, focusing on mocking Firebase SDK interactions.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor refactoring to improve testability, if necessary)
-   `src/__tests__/` (for new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `package.json` (only to add a `test` script if not already present for Vitest, no new dependencies)
-   `vite.config.ts` (for minor Vitest configuration, if necessary)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any file not explicitly listed in "Allowed Scope"

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker Prompt

Implement unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a test file:** Create a new file named `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Utilize `vitest` and `vi.mock` to mock Firestore SDK methods (e.g., `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`) to prevent actual database calls during tests. Focus on mocking the behavior expected by the helper functions in `src/lib/firestore.ts`.
3.  **Test helper functions:** Write unit tests for the core CRUD helper functions within `src/lib/firestore.ts` that interact with the mocked Firestore. Examples include functions for adding, fetching, updating, and deleting `nailItems`.
4.  **Verify interactions:** Ensure your tests assert that the mocked Firestore functions are called with the correct arguments and that the helper functions return expected values.
5.  **Add `test` script (if needed):** If `package.json` does not already have a `test` script that runs Vitest, add one (e.g., `"test": "vitest"`).
6.  **Ensure passing tests:** All new tests must pass.

**Acceptance Criteria:**
-   A new file `src/__tests__/firestore.test.ts` exists containing unit tests for `src/lib/firestore.ts` helper functions.
-   Firebase SDK interactions are mocked using Vitest's mocking capabilities.
-   Tests cover at least one add, one fetch (e.g., `getAllNailItems`), one update, and one delete operation via the helper functions.
-   All new tests pass successfully.
-   The changes adhere to the line diff limit.

**Required test commands:**
```bash
npm install # Ensure all dependencies are installed
npm run build
npm run lint
npm test # To run the new Vitest tests
```
