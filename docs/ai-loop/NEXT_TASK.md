# Worker Prompt Template

## Context

The product roadmap for `nail-report` includes improving stability and test coverage. Phase 2.1 specifically targets unit tests for Firestore helper functions. This task focuses on adding initial unit tests for the functions within `src/lib/firestore.ts` to ensure their correctness and robustness.

## Objective

Implement Vitest unit tests for at least two key helper functions exported from `src/lib/firestore.ts`, utilizing Firebase SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, minimal changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to ensure `vitest` scripts are correctly configured, no new dependencies)

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

Your task is to add unit tests for functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vitest`'s `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`). Ensure mocks return predictable values or throw controlled errors for testing various scenarios.
3.  **Test helper functions**: Identify and write unit tests for at least two exported helper functions from `src/lib/firestore.ts`. Examples include functions for adding, updating, or deleting nail items. Focus on testing happy paths and basic error handling where applicable.
4.  **Assertions**: Use `vitest`'s assertion library to verify the behavior of the helper functions.
5.  **Clean up**: Ensure no commented-out code or unused imports are left in the test file.

## Acceptance criteria

- A new file `src/__tests__/firestore.test.ts` is created.
- This file contains unit tests for a minimum of two distinct helper functions exported from `src/lib/firestore.ts`.
- The Firebase Firestore SDK is appropriately mocked using `vi.mock` within the test file.
- All tests pass when `npm run test` is executed.
- The `src/lib/firestore.ts` file remains largely unchanged, with any modifications strictly for testability.

## Required test commands

```bash
npm run test
npm run build
npm run lint
```
