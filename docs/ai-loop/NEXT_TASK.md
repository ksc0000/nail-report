# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The immediate focus is on establishing robust test coverage for core utility functions. This task is the first substantive step towards implementing unit tests for the Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on core CRUD operations and mocking the Firebase SDK.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily for understanding)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (CSS improvements - not applicable for this task)
- `vitest.config.ts` (if minimal configuration is needed for mocking, ensure no new npm dependencies are introduced)

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

## Worker prompt

Your task is to add unit tests for the core Firebase Firestore helper functions located in `src/lib/firestore.ts`.

**Steps:**

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` from Vitest to mock the necessary Firebase Firestore SDK functions (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`, etc.) to isolate the `firestore.ts` helpers during testing. Ensure mocks return predictable values for success and throw errors for failure scenarios.
3.  **Implement tests for `firestore.ts` helpers**:
    *   Focus on the CRUD operations: `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
    *   For each function, write at least one test case for a successful operation and one for an error scenario (e.g., Firestore operation fails).
    *   Verify that the functions correctly interact with the mocked Firebase SDK and return the expected data or throw appropriate errors.
    *   Ensure that any data transformations within the helper functions are correctly applied.
4.  **Verify test execution**: Ensure all new tests pass when running the test suite.

**Acceptance Criteria:**

*   A new test file `src/__tests__/firestore.test.ts` is created.
*   The `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts` have unit tests.
*   Firebase Firestore SDK functions are effectively mocked using `vi.mock`.
*   Tests cover both successful execution paths and basic error handling for the targeted functions.
*   All tests pass when `npm test` is run.
*   The overall diff remains within the ≤150 line limit.
*   No new npm dependencies are added to `package.json`.
