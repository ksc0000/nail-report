# Worker Prompt Template

## Context

The product roadmap for `nail-report` is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses "2.1 Test coverage", specifically for core Firebase helper functions.

## Objective

Add unit tests using Vitest for the functions within `src/lib/firestore.ts`. The tests should mock the Firebase Firestore SDK to ensure isolated testing of the helper logic.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minimal configuration for Vitest if absolutely necessary and not already present, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, assume Vitest is already a `devDependency`)
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

## Worker Prompt

### Task Description

Implement unit tests for the functions defined in `src/lib/firestore.ts`. This file contains helper functions that abstract interactions with Firebase Firestore. The goal is to verify the logic of these helpers in isolation.

### Detailed Steps

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Import necessary modules**: Import functions from `src/lib/firestore.ts` that need testing.
3.  **Mock Firebase Firestore SDK**: Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore` or specific functions like `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`). The mocks should simulate successful and potentially failed Firestore operations relevant to the functions being tested.
4.  **Write unit tests**:
    *   For each major function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, etc., if they exist), write at least one positive test case verifying successful execution.
    *   Consider edge cases or error paths if the `firestore.ts` helpers explicitly handle them (e.g., what happens if a `getDoc` returns null, or a `setDoc` fails).
5.  **Run tests**: Execute the tests using `npm test` or `vitest`.
6.  **Verify build and lint**: Ensure `npm run build` and `npm run lint` pass without errors.

### Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` exists and contains unit tests for functions in `src/lib/firestore.ts`.
-   The Firebase Firestore SDK is appropriately mocked using `vi.mock` to isolate the logic of the helper functions.
-   Tests cover the primary success paths of the `firestore.ts` helper functions.
-   All tests pass when running `npm test`.
-   `npm run build` and `npm run lint` complete successfully.

### Required Test Commands

```bash
npm test
npm run build
npm run lint
```
