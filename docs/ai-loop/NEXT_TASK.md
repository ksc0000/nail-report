# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, specifically improving stability, test coverage, and UX. This task addresses the "Test coverage" aspect by adding unit tests for existing Firebase-related helper functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, ensuring they correctly interact with the Firebase Firestore SDK.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts`
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `src/App.css` (CSS improvements - not applicable for this task but listed for completeness)

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

Implement unit tests for `src/lib/firestore.ts` helper functions using Vitest.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the `firebase/firestore` module to prevent actual calls to Firebase during tests. Specifically, mock functions like `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, and `onSnapshot` as necessary.
3.  **Identify target functions:** Focus on testing one or two simple CRUD helper functions in `src/lib/firestore.ts`, such as `addItem` or `deleteItem`, or `getNailItems`.
4.  **Write unit tests:**
    *   For `addItem`, test that `addDoc` is called with the correct collection reference and data.
    *   For `deleteItem`, test that `deleteDoc` is called with the correct document reference.
    *   For `getNailItems` or similar query functions, test that `collection`, `query`, and `getDocs` (or `onSnapshot` if applicable) are called with the expected arguments.
5.  **Assert calls:** Use Vitest's `expect().toHaveBeenCalledWith()` or `toHaveBeenCalledTimes()` to verify that the mocked Firebase SDK functions are called as expected by your helper functions.
6.  **Do not test Firebase itself:** The goal is to test that *your* helper functions correctly call the Firebase SDK, not to test the Firebase SDK's functionality.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
