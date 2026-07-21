```markdown
# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. The current state indicates that no substantive `Jules-ready` tasks have been completed yet. The `in_progress_tasks` shows "First substantive task pending (Issue #135)".

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This aligns with Phase 2.1 (Test coverage) of the roadmap.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactoring to improve testability, if necessary)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/__mocks__/firebase-sdk.ts` (or similar new mock files if needed for Firebase SDK mocking)
-   `vite.config.ts` (if minor Vitest configuration is strictly required, e.g., for mock paths)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`

## Requirements

-   Keep diff ≤ 150 lines.
-   Add a new test file: `src/__tests__/firestore.test.ts`.
-   Focus on testing key helper functions in `src/lib/firestore.ts` (e.g., functions for adding, updating, fetching, or deleting nail items).
-   Utilize Vitest for testing. Firebase SDK interactions should be mocked. Refer to existing Vitest setup or add new mocks as needed.
-   Ensure tests are self-contained and do not make actual calls to Firebase services.
-   Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to add unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a new test file**: `src/__tests__/firestore.test.ts`.
2.  **Identify key functions**: Review `src/lib/firestore.ts` and select a few core helper functions to test first. Examples might include `addNailItem`, `updateNailItem`, `getNailItems`, `deleteNailItem`, or any other utility functions that interact with Firestore.
3.  **Mock Firebase SDK**: Implement necessary mocks for the Firebase SDK (e.g., `firebase/firestore`, `firebase/auth`) using `vi.mock()` to isolate the `firestore.ts` logic. You may need to create a new mock file (e.g., `src/__mocks__/firebase/firestore.ts`) if a suitable one doesn't already exist.
4.  **Write unit tests**: For each selected function, write one or more unit tests that cover its expected behavior and potential edge cases (e.g., successful operations, error handling).
5.  **Ensure no real Firebase calls**: Verify that your tests do not make actual network requests to Firebase.
6.  **Run checks**: Before concluding, run `npm run build`, `npm run lint`, and `npm test` to ensure everything passes.
```
