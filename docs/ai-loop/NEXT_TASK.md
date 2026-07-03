# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses `2.1 Test coverage` by adding unit tests to the core Firebase interactions.

## Objective

Implement unit tests for one or two helper functions within `src/lib/firestore.ts` using Vitest. The goal is to establish a testing foundation for Firestore-related logic.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minor additions for setup, if strictly needed for mocks)

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

Your task is to add unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock('firebase/firestore')` to mock Firestore functions like `collection`, `addDoc`, `getDocs`, `query`, etc. You will need to mock the return values for successful operations.
3.  **Test `addNailItem`**:
    *   Verify that `addDoc` is called with the correct collection reference and data.
    *   Assert that the function returns the expected result (e.g., the added document's ID).
4.  **Test `getNailItems`**:
    *   Verify that `query` and `getDocs` are called correctly.
    *   Mock `getDocs` to return a `QuerySnapshot` containing mock `QueryDocumentSnapshot` objects.
    *   Assert that the function correctly transforms the snapshot data into an array of `NailItem` objects.
5.  **Keep it focused**: Only test `addNailItem` and `getNailItems` to keep the PR small. If adding full mocks for both proves too large, prioritize `addNailItem`.
6.  **Ensure tests pass**: Run `npm run test` to confirm tests are working.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` exists.
- Unit tests are implemented for `addNailItem` and `getNailItems` in `src/lib/firestore.ts`.
- Firebase Firestore SDK calls are properly mocked using `vi.mock`.
- The tests assert the correct behavior of the functions for successful cases.

## Required test commands

```bash
npm run build
npm run lint
npm run test
```
