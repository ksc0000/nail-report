```markdown
# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic unless strictly necessary for testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration needs adjustment for mocking, but prefer to use existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related files

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file for `firestore.ts` helpers.
- Use `vitest` for tests.
- Mock Firebase SDK functions (e.g., Firestore and Auth instances, collection/doc/query methods) to ensure tests are isolated and do not interact with live Firebase services. Refer to Vitest's `vi.mock` documentation for mocking modules.
- Focus on testing the core logic of functions like `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, and any other significant helpers in `firestore.ts`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

# Worker Prompt

## Summary

This task involves setting up unit tests for the `src/lib/firestore.ts` helper functions. The primary goal is to ensure the logic handling Firestore interactions is robust and correctly implemented by mocking Firebase SDK dependencies.

## Detailed Instructions

1.  **Create a New Test File**:
    *   Create a new file: `src/__tests__/lib/firestore.test.ts`.

2.  **Mock Firebase SDK**:
    *   Inside `src/__tests__/lib/firestore.test.ts`, use `vi.mock` to mock the Firebase SDK imports that `src/lib/firestore.ts` depends on (e.g., `firebase/firestore`, `firebase/auth`).
    *   The mock should simulate the behavior of Firestore methods (`collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) and return predictable test data or resolve/reject promises as appropriate for testing success and error paths.
    *   Ensure the mocks allow you to test how `firestore.ts` functions process input and format output, without making actual network requests to Firebase.

3.  **Write Unit Tests**:
    *   For each significant helper function in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`), write at least one passing test case.
    *   Consider writing test cases for both successful operations and potential error scenarios (e.g., Firebase throws an error).
    *   Use Vitest's assertion library (`expect`) to verify the outcomes.

4.  **Verify Test Execution**:
    *   Run `npm run test` to execute the newly created tests.
    *   Ensure all new tests pass.

## Acceptance Criteria

*   A new file `src/__tests__/lib/firestore.test.ts` exists.
*   This file contains unit tests for key functions in `src/lib/firestore.ts`.
*   Firebase SDK dependencies are correctly mocked using `vi.mock`.
*   Tests cover successful data operations and, where applicable, error handling for Firestore interactions.
*   All new tests pass when `npm run test` is executed.
*   `npm run build` and `npm run lint` pass without errors or warnings.

## Required Test Commands

```bash
npm run build
npm run lint
npm run test
```
```
