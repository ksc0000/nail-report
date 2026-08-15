# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal.

## Objective

Implement Vitest unit tests for the `addNailItem` and `deleteNailItem` functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer not to)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/__tests__/__mocks__/` (new mock files if needed)

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

## Worker Prompt

Your task is to add unit tests for two specific Firestore helper functions: `addNailItem` and `deleteNailItem`, located in `src/lib/firestore.ts`.

1.  **Create a New Test File**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vitest`'s mocking capabilities (`vi.mock`) to mock the Firebase SDK (specifically `firebase/firestore`). Ensure that calls to `getFirestore`, `collection`, `doc`, `addDoc`, and `deleteDoc` do not interact with a live Firebase instance. Instead, they should return controlled, predictable values or throw mocked errors to test error paths.
    *   You may need to create a dedicated mock file for `firebase/firestore` if the mocking becomes complex.
3.  **Test `addNailItem`**:
    *   Write a test case to verify that `addDoc` is called with the correct Firestore collection reference (e.g., "nailItems") and the provided `NailItem` data.
    *   Verify that `addNailItem` returns the mocked document ID (e.g., `new-doc-id`).
    *   Add a test case to ensure `addNailItem` gracefully handles and propagates errors from `addDoc` (e.g., by mocking `addDoc` to throw an error).
4.  **Test `deleteNailItem`**:
    *   Write a test case to verify that `deleteDoc` is called with the correct Firestore document reference constructed from the provided `id`.
    *   Add a test case to ensure `deleteNailItem` gracefully handles and propagates errors from `deleteDoc`.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- The `addNailItem` and `deleteNailItem` functions in `src/lib/firestore.ts` are covered by dedicated unit tests.
- Firebase SDK (Firestore) interactions are thoroughly mocked using `vi.mock` to prevent actual network calls.
- Tests verify correct function calls, return values, and error handling for both `addNailItem` and `deleteNailItem`.
- All added tests pass successfully.

## Required Test Commands

```bash
npm test src/__tests__/firestore.test.ts
npm run build
npm run lint
```
