# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. The current state shows that test coverage is a primary goal.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on the core CRUD operations for `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments needed for testability)
- `src/__tests__/` (for new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, but prefer mocking in test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related CSS files
- Any files outside `src/lib/firestore.ts` and `src/__tests__/` that are not directly related to unit testing `firestore.ts`

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, e.g., `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK calls (e.g., `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `doc`, `collection`) within the test file to isolate the `firestore.ts` logic.
- Write at least one passing unit test for each major `nailItem` related CRUD function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Focus on testing the logic within `firestore.ts`, not on testing the Firebase SDK itself.
- Ensure the tests execute successfully.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add unit tests for the core Firestore helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: In `src/__tests__/lib/`, create `firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` from Vitest to mock the Firebase Firestore SDK functions that `src/lib/firestore.ts` interacts with. This will allow you to control the behavior of `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `doc`, `collection`, etc., without actually hitting the Firebase backend.
3.  **Identify key functions**: Focus on the functions that perform CRUD operations for `nailItems` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getAllTags`).
4.  **Write tests**: For each identified function, write at least one unit test case that asserts its successful execution.
    *   For `addNailItem`, verify that `addDoc` was called with the correct arguments and that the function returns the expected result.
    *   For `getNailItems`, mock a return value for `getDocs` and assert that `getNailItems` correctly transforms and returns the data.
    *   For `updateNailItem`, verify that `updateDoc` was called with the correct ID and data.
    *   For `deleteNailItem`, verify that `deleteDoc` was called with the correct ID.
    *   For `getAllTags`, mock a return value for `getDocs` and assert that `getAllTags` correctly extracts and returns unique tags.
5.  **Run tests**: Execute `npm test` and ensure all new tests pass.
6.  **Lint and Build**: Run `npm run build && npm run lint` to ensure no new errors are introduced.
