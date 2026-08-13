# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. A key objective for this phase is to increase unit test coverage, particularly for Firebase helper functions. Vitest has been selected as the test runner.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering the core CRUD operations (add, get, update, delete) and any utility functions present in that file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions for path aliases or globals if absolutely necessary for mocking, but avoid if possible)

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
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (Firestore instances, collection references, doc references) using `vi.mock` as needed to test the helper logic in isolation.
- Write tests that assert the correct Firebase SDK methods are called with the expected arguments, and that the helper functions return the expected values or handle errors appropriately.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` to mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`). The goal is to test the logic within `src/lib/firestore.ts` without making actual calls to Firebase.
3.  **Write tests for `firestore.ts` functions**:
    *   Cover at least the main CRUD operations (e.g., if functions like `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem` exist, test them).
    *   Verify that the mocked Firebase methods are called with the correct parameters (e.g., correct collection paths, data objects).
    *   Ensure the functions handle successful operations and potential errors gracefully, returning expected values or throwing errors.
4.  **Run tests**: Make sure all new tests pass.
5.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass without errors.
