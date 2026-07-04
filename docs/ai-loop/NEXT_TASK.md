# Worker Prompt Template

## Context

The product is in Phase 2, focusing on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" goal by adding foundational unit tests for core Firebase operations.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (to export functions if needed for testing, or add minor adjustments for testability)
- `src/__tests__/` (new test files, specifically `src/__tests__/firestore.test.ts`)
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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add comprehensive unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Utilize Vitest:** Assume Vitest is configured and available as a dev dependency. Do NOT add `vitest` or any other new npm package to `package.json`.
3.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `setDoc`, `deleteDoc`, `getDocs`, etc.) to isolate the functions under test.
4.  **Target functions:** Write unit tests for the following key functions within `src/lib/firestore.ts`:
    *   `addItem` (ensuring data is correctly passed to `addDoc`)
    *   `updateItem` (ensuring data and ID are correctly passed to `setDoc`)
    *   `deleteItem` (ensuring ID is correctly passed to `deleteDoc`)
    *   `getItemsForUser` (mocking the query and snapshot to return expected data)
5.  **Test Cases:**
    *   Ensure successful execution for each function.
    *   Test error handling if the existing functions include explicit `try/catch` blocks (or mock Firebase functions to throw errors).
    *   Verify the arguments passed to the mocked Firebase functions are correct.
6.  **Run Tests:** Execute `npm run test` and ensure all new tests pass.
7.  **Lint and Build:** Before submitting, run `npm run build` and `npm run lint` to confirm no build errors or linting issues are introduced.
