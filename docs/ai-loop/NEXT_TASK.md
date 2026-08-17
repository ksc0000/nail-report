# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task focuses on improving test coverage as outlined in section 2.1 of the roadmap. Vitest is already configured as the test runner.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` (specifically `src/lib/firestore.ts`)
- `src/__tests__/` (new test files, e.g., `src/__tests__/lib/firestore.test.ts`)

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

Implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vitest` and `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the *behavior* of these functions relevant to how `src/lib/firestore.ts` interacts with them.
3.  **Write unit tests**:
    *   Test `getNailItems` to ensure it correctly calls Firestore's `collection` and `getDocs` and maps the results.
    *   Test `addNailItem` to verify it calls `collection` and `addDoc` with the correct payload.
    *   Test `updateNailItem` to ensure it calls `doc` and `updateDoc` with the correct ID and partial data.
    *   Test `deleteNailItem` to confirm it calls `doc` and `deleteDoc` with the correct ID.
4.  **Assertions**: Use Vitest's assertion library to check that the mocked Firebase functions are called with the expected arguments and that the helper functions return the expected values.
5.  **Run tests**: Verify all new tests pass by running `npm test`.
6.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass without errors.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
