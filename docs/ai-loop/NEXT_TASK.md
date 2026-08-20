```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task specifically targets "2.1 Test coverage" by adding unit tests to a core utility file.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest setup is incomplete, minimal changes)

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
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock the Firebase Firestore SDK using `vi.mock` to isolate tests from actual Firebase calls.
- Write unit tests for at least 3-4 key CRUD-related functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover successful operations and basic error scenarios if applicable.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the `src/lib/firestore.ts` utility file.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore:** Use `vi.mock` to mock the Firebase Firestore SDK methods that `src/lib/firestore.ts` interacts with. This will involve mocking `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, etc., as needed. Ensure tests do not make actual calls to Firebase.
3.  **Write Unit Tests:** Implement unit tests for the primary CRUD functions exported by `src/lib/firestore.ts`. Focus on functions like `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` (or similar functions based on the actual implementation).
    *   Each test should verify the correct behavior of the function, including arguments passed to the mocked Firebase methods and the return value.
    *   Consider adding a simple test for a failure scenario (e.g., mocked Firebase method throws an error).
4.  **Run tests:** Execute `npm test` and ensure all new tests pass.
5.  **Lint and Build:** Run `npm run lint` and `npm run build` to confirm no new issues are introduced.

This task aims to improve the test coverage of critical Firebase interaction logic, making the application more robust.
```
