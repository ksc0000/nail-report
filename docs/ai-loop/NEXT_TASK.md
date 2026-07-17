# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the process of adding unit tests to critical helper functions, starting with `src/lib/firestore.ts`. The goal is to improve the reliability of data operations.

## Objective

Implement unit tests for one key helper function within `src/lib/firestore.ts`, specifically focusing on `getNailItems`, using Vitest and mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications if needed for testability, e.g., exporting internal helpers)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (minimal additions for mocking setup, if required and not already present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant to this task)
- Any other `src/` files not explicitly mentioned in Allowed Scope, unless directly related to `src/lib/firestore.ts` for testability purposes and within line limits.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write at least one unit test for the `getNailItems` function in `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase Firestore SDK functions (e.g., `collection`, `getDocs`, `query`, `orderBy`, `where`, `doc`, `getDoc`) to isolate the `getNailItems` logic.
- The test should verify that `getNailItems` correctly processes data fetched from a mocked Firestore response.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to add initial unit tests for the `getNailItems` function located in `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest environment**: Ensure the test file can run with Vitest.
3.  **Mock Firebase Firestore SDK**: Implement `vi.mock` for `@firebase/firestore` or `firebase/firestore` to control the responses of functions like `collection`, `getDocs`, `query`, etc.
    *   The mock should simulate a successful retrieval of nail items, including their `id` and `data()`.
4.  **Write unit tests for `getNailItems`**:
    *   Test that `getNailItems` correctly fetches and formats the nail items when the mocked Firestore returns data.
    *   Verify that the returned array contains items with the expected structure (e.g., `id` and other properties).
5.  **Run tests**: Execute `npm test` to confirm your tests pass.
6.  **Lint and build**: Ensure `npm run lint` and `npm run build` pass without errors.

The primary goal is to establish a basic test for a Firestore helper, demonstrating the pattern for future test coverage. Focus on a single happy-path scenario for `getNailItems` to keep the PR small.
