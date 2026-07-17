# Worker Prompt Template

## Context

The application needs improved test coverage for its core utility functions. The roadmap prioritizes unit tests for Firebase helper functions. Vitest is the chosen test runner and is expected to be already configured.

## Objective

Write comprehensive unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest. This involves creating a new test file, writing test cases for each public function, and appropriately mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if necessary, but primarily for testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor adjustments are needed for mocking setup, but *no new npm dependencies*)
- Existing test setup files (e.g., global mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (do NOT add new npm packages; Vitest is assumed to be installed)
- Firebase deploy commands
- Secrets and credentials
- Modifying `package.json` scripts (assume `npm run test` is already configured for Vitest)

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

Implement unit tests for the functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` functions (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the behavior necessary for `firestore.ts` functions to execute without hitting actual Firebase.
3.  **Test each public function:** Write unit tests for all public helper functions exported from `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, etc.
4.  **Assert behavior:**
    *   Verify that the correct Firebase SDK functions are called with the expected arguments.
    *   Verify that the functions return the expected values or throw errors as appropriate.
    *   Ensure proper error handling is tested where relevant.

**Acceptance Criteria:**

*   A new file `src/__tests__/lib/firestore.test.ts` exists.
*   All public functions in `src/lib/firestore.ts` have at least one passing unit test.
*   Firebase Firestore SDK functions are mocked to isolate `firestore.ts` logic.
*   Tests pass when running `npm run test`.

**Required Test Commands:**

```bash
npm run build
npm run lint
npm run test
```
