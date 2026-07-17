# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. The current state indicates that Phase 2 is active, and a first substantive task is pending. The goal is to incrementally improve the application by addressing a core aspect of stability: test coverage for critical helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This task directly addresses "2.1 Test coverage" from the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications if absolutely necessary for testability, keep diff small)
- `src/lib/__tests__/firestore.test.ts` (new file)
- `src/` (other existing files only if strictly required for testing setup, e.g., `vitest.config.ts` if not already configured for mocks, but prefer to assume Vitest is setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

### Task: Implement Vitest unit tests for `src/lib/firestore.ts`

**Detailed Instructions:**

1.  **Create a New Test File:**
    *   Create a new file at `src/lib/__tests__/firestore.test.ts`.

2.  **Inspect `src/lib/firestore.ts`:**
    *   Identify the key exported helper functions responsible for interacting with Firestore (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, and any related data transformation or utility functions).

3.  **Mock Firebase SDK:**
    *   Utilize `vi.mock` from Vitest to mock Firebase Firestore SDK functions. This is crucial for isolating the unit under test and preventing actual database calls during testing.
    *   Mocks should simulate successful responses and error conditions where applicable, especially for `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, etc.

4.  **Write Unit Tests:**
    *   For each identified helper function in `src/lib/firestore.ts`, write at least one unit test case.
    *   **Focus on happy paths:** Ensure functions correctly handle typical inputs and produce expected outputs.
    *   **Consider error paths:** If the functions include error handling (e.g., try-catch blocks), write tests that simulate Firestore errors (e.g., rejected promises from mocked Firebase calls) and verify the helper functions handle them gracefully (e.g., throw a custom error, return `null`, log an error).
    *   Use `expect` assertions to verify function behavior, return values, and side effects (like calls to mocked Firebase functions).

5.  **Example Testing Targets (Jules should verify actual functions in `firestore.ts`):**
    *   `addNailItem`: Test successful addition, ensure correct data is passed to Firestore mock.
    *   `getNailItems`: Test successful retrieval of a list, ensure data transformation is correct. Test behavior when no items are found.
    *   `getNailItemById`: Test successful retrieval of a single item, test behavior when item not found.
    *   `updateNailItem`: Test successful update, ensure correct ID and data are passed.
    *   `deleteNailItem`: Test successful deletion, ensure correct ID is passed.

6.  **Maintain Test Isolation:**
    *   Each test should be independent and not rely on the state set up by previous tests. Use `beforeEach` or `afterEach` for cleanup if necessary (though for mocking, `vi.mock` usually handles this well).

7.  **Review `vitest.config.ts` (if it exists):**
    *   Ensure Vitest is correctly configured to find and run tests in `src/lib/__tests__/`. If a `vitest.config.ts` file doesn't exist, assume default Vitest behavior or create a minimal one to enable mocking if needed (but prefer to assume it's already set up). **Do not add new npm dependencies for Vitest configuration.**

### Acceptance Criteria:

*   A new file `src/lib/__tests__/firestore.test.ts` is created.
*   This file contains unit tests for at least the primary CRUD-related helper functions in `src/lib/firestore.ts`.
*   Firebase Firestore SDK functions are effectively mocked to prevent actual database calls.
*   Tests cover both successful execution and simulated error conditions where appropriate.
*   All new tests pass when `npm run test` is executed.
*   The overall PR diff is ≤ 150 lines.

### Required Test Commands:

```bash
npm install # Ensure all dependencies are in place
npm run build
npm run lint
npm run test # Execute the new Vitest tests
```
