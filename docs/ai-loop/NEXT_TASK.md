# Worker Prompt Template

## Context

The current focus for `nail-report` is Phase 2 of the roadmap, which aims to improve stability, test coverage, and UX. This task specifically addresses the "Test coverage" aspect by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest and write initial unit tests for the helper functions in `src/lib/firestore.ts`. This task aims to establish a testing framework for Firebase interactions and increase test coverage for critical data operations.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions if needed, but prefer to test public API)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `src/__tests__/setupTests.ts` (new file for global test setup, if needed for Firebase mocking)
- `vitest.config.ts` (minor adjustments for mocking configuration, if necessary)
- `package.json` (only to confirm `vitest` is a dev dependency, no new packages should be added)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages should be installed; `vitest` is assumed to be an existing dev dependency based on the roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.
- Ensure all new tests pass when running `npm run test`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

### Task: Implement Unit Tests for `src/lib/firestore.ts`

1.  **Verify Vitest Setup:**
    *   Ensure `vitest` is properly configured as a development dependency and `npm run test` command is functional.
    *   If `vitest.config.ts` requires minor additions for alias paths or similar, make them, but avoid significant configuration changes.

2.  **Create Test File:**
    *   Create a new test file: `src/__tests__/lib/firestore.test.ts`.

3.  **Mock Firebase Firestore SDK:**
    *   Within `src/__tests__/lib/firestore.test.ts` (or a dedicated setup file if preferred), implement comprehensive mocking for the Firebase Firestore SDK using `vi.mock`.
    *   The goal is to isolate the functions in `src/lib/firestore.ts` from actual Firebase network calls.
    *   Mock key Firestore functions and objects that `firestore.ts` interacts with, such as `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, and their return values (e.g., `querySnapshot`, `DocumentReference`). Use in-memory data structures or simple mocks to simulate Firestore behavior.

4.  **Write Unit Tests for `firestore.ts` functions:**
    *   Add unit tests for the primary CRUD helper functions exported from `src/lib/firestore.ts`. Focus on functions like:
        *   `addNailItem`
        *   `getNailItems`
        *   `updateNailItem`
        *   `deleteNailItem`
    *   For each function:
        *   Test its successful execution with valid inputs, verifying that the mocked Firestore methods were called with the correct arguments.
        *   Test edge cases or error scenarios (e.g., if a mocked Firestore operation throws an error), ensuring the helper function handles it gracefully (if designed to).
    *   Ensure tests cover how data is transformed or processed before being sent to (or after being received from) Firestore.

5.  **Run Tests:**
    *   Execute `npm run test` to verify that all newly added tests pass.
    *   Confirm that the tests run without making actual calls to Firebase Firestore.
