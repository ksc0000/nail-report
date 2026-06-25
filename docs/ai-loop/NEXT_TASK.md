# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "Test coverage" objective by adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, ensuring Firebase SDK calls are appropriately mocked.

## Allowed Scope

- `src/lib/firestore.ts` (no functional changes, but imports might be adjusted for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (only if necessary for Vitest setup, but unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other CSS files
- `src/App.tsx` or other UI components

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `doc`, `collection`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` as specified in the roadmap for testing helper functions.
- Focus on testing the core CRUD helper functions within `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, and `deleteNailItem`.
- Ensure tests verify the correct arguments are passed to the mocked Firebase functions and that the helper functions handle success/failure scenarios appropriately.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to implement unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Set up `vi.mock('firebase/firestore')` to mock the Firebase Firestore SDK functions (`collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, etc.) that `src/lib/firestore.ts` uses. The mocks should allow you to assert on function calls and control their return values (e.g., successful document writes, errors).
3.  **Implement Unit Tests**: Write unit tests for the following helper functions in `src/lib/firestore.ts`:
    *   `addNailItem`: Verify it calls `addDoc` with the correct collection reference and data.
    *   `updateNailItem`: Verify it calls `updateDoc` with the correct document reference and update data.
    *   `deleteNailItem`: Verify it calls `deleteDoc` with the correct document reference.
4.  **Test Scenarios**: For each function, include at least one test case for a successful operation and one for an error scenario (e.g., Firebase throws an error).
5.  **Clean Up**: Ensure the test file cleans up any mock state between tests if necessary.
6.  **Verify**: Run `npm run build && npm run lint` to ensure no build or linting errors.

The goal is to demonstrate that the `firestore.ts` helper functions correctly interact with the Firebase SDK (via mocks) and handle their internal logic.
