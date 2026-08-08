# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. Phase 2.1 specifically targets unit tests for helper functions. This task aims to kickstart the test coverage for the Firebase-related utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not to)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vite.config.ts` (if Vitest setup needs minor adjustments for mocking, but unlikely)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement Vitest unit tests for the functions in `src/lib/firestore.ts`.

**Detailed steps:**

1.  Create a new test file: `src/__tests__/lib/firestore.test.ts`.
2.  Set up mocking for the Firebase SDK using `vi.mock('firebase/firestore')` and `vi.mock('firebase/app')` (if needed for `getFirestore`).
    *   Mock necessary Firestore functions such as `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`.
    *   Mock their return values to simulate successful and failed operations.
3.  Write tests for the following functions in `src/lib/firestore.ts`:
    *   `getNailItems` (test fetching items, handling empty collections, and potential errors)
    *   `addNailItem` (test successful addition and error handling)
    *   `updateNailItem` (test successful update and error handling)
    *   `deleteNailItem` (test successful deletion and error handling)
    *   `getPublicShare` (test fetching a share, non-existent share, and errors)
    *   `addPublicShare` (test successful addition and error handling)
    *   `deletePublicShare` (test successful deletion and error handling)
4.  Ensure tests cover:
    *   Successful execution paths.
    *   Cases where Firestore operations might throw errors.
    *   Correct data transformation/mapping where applicable.
5.  Run `npm test` to confirm tests pass.
6.  Ensure `npm run build` and `npm run lint` pass without errors or warnings.

**Acceptance Criteria:**

- A new file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains unit tests for `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, and `deletePublicShare` from `src/lib/firestore.ts`.
- Firebase SDK functions are properly mocked to isolate the `firestore.ts` logic.
- Tests verify both success and error paths for the tested functions.
- All tests pass when `npm test` is executed.

**Required test commands:**

```bash
npm test
npm run build
npm run lint
```
