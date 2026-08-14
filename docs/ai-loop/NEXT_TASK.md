# Worker Prompt Template

## Context

The product roadmap indicates that improving stability and test coverage is a key focus in Phase 2. Currently, the application lacks unit tests for its core Firebase helper functions. This task addresses the first item in the "Jules-ready Tasks" list, focusing on test coverage for `src/lib/firestore.ts`.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Mock Firebase SDK dependencies where necessary to ensure tests are isolated and run efficiently without actual Firebase interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (any other new test helper files if strictly necessary and small)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (no CSS changes for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.).
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK methods (`firebase/firestore`).
- Ensure tests run successfully without network calls or actual Firebase project access.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the `src/lib/firestore.ts` file.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocks**: Within `firestore.test.ts`, use `vi.mock` to mock the necessary functions from `firebase/firestore`. This will prevent actual calls to Firebase during testing. Focus on mocking functions like `collection`, `query`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `where`, etc., that are used in `src/lib/firestore.ts`.
3.  **Write tests for `getNailItems`**:
    *   Test that `getNailItems` correctly fetches and processes data from a mocked Firestore response.
    *   Test edge cases, such as an empty collection.
4.  **Write tests for at least one other helper function**: Choose another function from `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`) and write unit tests for it, ensuring it interacts correctly with the mocked Firestore.
5.  **Run tests**: Execute the tests using `npm test` and ensure they all pass.
6.  **Lint and Build**: Ensure the project still builds and passes lint checks.

This task is focused solely on adding tests for `firestore.ts` and not for `storage.ts` or `auth.ts`. Mocking should be thorough enough to prevent any real Firebase interaction.
