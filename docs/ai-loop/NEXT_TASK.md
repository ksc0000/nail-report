```markdown
# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase interactions.

## Objective

Add unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest. The focus should be on functions that interact with the Firestore SDK, ensuring they handle success and error cases correctly.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding functions to be tested)
- `src/__tests__/firestore.test.ts` (create this new file for tests)
- `src/setupTests.ts` (if basic Vitest setup/mocks are needed, but prefer inline mocks in the test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed within the test file using `vi.mock`.
- Cover basic CRUD operations (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`) in `src/lib/firestore.ts`.
- Test both successful operations and potential error scenarios.
- Run `npm run test` and ensure tests pass.
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

Jules, your task is to implement unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock('firebase/firestore', ...)` to mock the necessary Firestore functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Ensure the mocks provide predictable responses for successful and error cases.
3.  **Test helper functions**: Write unit tests for the primary helper functions exported from `src/lib/firestore.ts`. Examples include:
    *   `addNailItem`: Test successful addition and ensure correct data is passed.
    *   `getNailItems`: Test successful retrieval of a list of items.
    *   `updateNailItem`: Test successful update of an item.
    *   `deleteNailItem`: Test successful deletion of an item.
    *   For each tested function, include at least one test case for a successful operation and one for an error scenario (e.g., if a Firestore operation throws an error).
4.  **Ensure test isolation**: Tests should not rely on actual Firebase connections.
5.  **Run tests**: Execute `npm run test` and verify all new tests pass.
6.  **Lint and Build**: Ensure the project still builds and passes lint checks by running `npm run build && npm run lint`.
```
