# Worker Prompt Template

## Context

The roadmap prioritizes improving stability and test coverage in Phase 2.1. This task focuses on adding unit tests for core Firebase Firestore helper functions, which are critical for data management. Mocking Firebase SDK is explicitly mentioned as a requirement for these tests.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (minimal changes for testability if necessary, e.g., exporting internal functions if not already)
- `src/__tests__/lib/firestore.test.ts` (new test file for Firestore helpers)

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

### Task: Add Vitest unit tests for `src/lib/firestore.ts` helpers

1.  **Create a new test file:** `src/__tests__/lib/firestore.test.ts`.
2.  **Import necessary utilities:** Import functions from `src/lib/firestore.ts` that need to be tested.
3.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) to prevent actual Firebase calls during tests. Ensure mock implementations simulate successful operations and potential error cases.
4.  **Write unit tests:**
    *   Focus on key functions such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
    *   Write at least one successful test case for each selected function.
    *   Consider adding one test case per function to cover an error scenario (e.g., Firestore operation fails).
    *   Use Vitest's `describe`, `it`, `expect` syntax.
5.  **Ensure test isolation:** Each test should run independently without side effects from other tests.

### Acceptance Criteria

*   A new file `src/__tests__/lib/firestore.test.ts` exists.
*   This file contains `describe` blocks and `it` blocks testing at least `addNailItem` and `getNailItems`.
*   Firebase Firestore SDK dependencies are mocked using `vi.mock`.
*   Tests cover both successful execution and simulated error conditions for the tested functions.
*   All new tests pass when running `npm test`.

### Required test commands

```bash
npm run build
npm run lint
npm test src/__tests__/lib/firestore.test.ts
```
