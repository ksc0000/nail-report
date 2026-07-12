```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-goal in this phase is to increase test coverage, starting with core utility functions. This task directly addresses Phase 2.1: "Unit tests for Firestore helper functions (`src/lib/firestore.ts`)".

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (only if absolutely necessary for Firebase mocking, otherwise avoid)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/firestore.test.ts`.
- Identify key helper functions within `src/lib/firestore.ts` (e.g., functions wrapping `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, or any data transformation logic related to Firestore documents).
- Write unit tests for at least 2-3 of these helper functions.
- Mock the Firebase SDK as required to perform isolated unit testing using `vitest` and `vi.mock`. Do not make actual calls to Firebase services during tests.
- Ensure the tests are clear, concise, and cover basic success and error paths where applicable for the chosen functions.
- Run `npm run build && npm run lint && npm run test` before finishing.
- All new and existing tests must pass.

## Worker prompt

Jules, your task is to enhance the test coverage for the `nail-report` application by introducing unit tests for the Firebase Firestore helper functions.

1.  **Examine `src/lib/firestore.ts`**: Identify the primary helper functions that interact with Firestore (e.g., functions for adding, fetching, updating, or deleting nail items, or public shares, or any data transformation logic for these).
2.  **Create Test File**: Create a new file named `src/__tests__/firestore.test.ts`.
3.  **Set up Vitest Mocking**:
    *   Configure Vitest to mock the Firebase SDK (Firestore specifically) so that your tests do not make actual network calls. Use `vi.mock` for this purpose.
    *   You will likely need to mock `firebase/firestore`.
4.  **Write Unit Tests**:
    *   Choose 2-3 significant helper functions from `src/lib/firestore.ts`.
    *   For each chosen function, write comprehensive unit tests covering:
        *   Successful execution paths (e.g., adding a document, fetching documents).
        *   Basic error handling (e.g., if a Firestore operation fails).
    *   Focus on testing the *logic within* your helper functions, assuming the mocked Firebase SDK behaves as expected.
5.  **Run Tests and Linters**: Execute `npm run build && npm run lint && npm run test`. Ensure all commands pass without errors.
6.  **Adhere to Constraints**: Remember the ≤ 150 lines diff limit and no new npm dependencies.

Example of potential functions to test: `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`.

```
```
