# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. We are currently in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task focuses on test coverage for our Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to improve testability, if necessary)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)

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

## Worker Prompt

Your task is to add unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock('firebase/firestore')` to mock Firestore SDK functions (e.g., `getDoc`, `setDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `collection`, `query`, `where`, `getDocs`, etc.). Ensure the mocks return predictable data or resolve/reject promises as needed for testing success and error paths.
3.  **Test key helper functions:** Write tests for at least the following functions from `src/lib/firestore.ts`:
    *   `addNailItem` (test successful addition and error handling)
    *   `getNailItems` (test successful retrieval of a list, including empty states)
    *   `updateNailItem` (test successful update and error handling)
    *   `deleteNailItem` (test successful deletion and error handling)
4.  **Focus on isolation:** Ensure tests mock out actual Firebase calls to test only the logic within `firestore.ts`, not the Firebase service itself.
5.  **Run checks:** Before submitting, run `npm run build` and `npm run lint`.

**Acceptance Criteria:**
*   A new file `src/__tests__/firestore.test.ts` exists.
*   The new test file contains unit tests for at least `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` functions.
*   Firebase SDK interactions within `firestore.test.ts` are mocked using `vi.mock`.
*   All new tests pass.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
