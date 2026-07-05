# Worker Prompt Template

## Context

The current focus is on improving stability and test coverage. The roadmap explicitly calls for unit tests for Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on essential CRUD operations (e.g., `addDocument`, `updateDocument`, `deleteDocument`, `getCollection`, `getDocument`).

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if absolutely required for test setup, but prefer to assume existing config)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly mentioned in "Allowed Scope".

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Use Vitest for testing, mocking Firebase SDK calls as needed.
- Write tests that verify the correct Firestore methods are called with the expected arguments.
- Do not make actual calls to a live Firebase project during tests.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

Your task is to implement unit tests for the functions in `src/lib/firestore.ts`.
1.  Create a new test file `src/__tests__/firestore.test.ts`.
2.  Inside this file, use `vi.mock('firebase/firestore')` to mock the Firebase Firestore SDK.
3.  Write unit tests for the core functions such as `addDocument`, `updateDocument`, `deleteDocument`, `getCollection`, and `getDocument`.
4.  For each function, ensure you test that the underlying mocked Firestore methods (e.g., `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc`) are called correctly with the expected parameters.
5.  Do not attempt to connect to a real Firebase project during these tests.
6.  Ensure all new tests pass without errors.
7.  Verify `npm run build`, `npm run lint`, and `npm run test` all pass.
