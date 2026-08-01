# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The immediate next step is to address test coverage for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on key functions that interact with Firestore for CRUD operations.

## Allowed Scope

-   `src/lib/firestore.ts` (for potential minor adjustments needed for testing, e.g., exports)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `src/lib/auth.ts` (if mocking Firebase Auth is required for Firestore tests)
-   `src/lib/storage.ts` (if Firestore operations indirectly involve storage, though less likely for initial tests)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (do NOT add new npm packages, Vitest is assumed to be configured)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for the creation of `src/__tests__` files.

## Requirements

-   Create a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Write unit tests for critical functions in `src/lib/firestore.ts`, such as those for adding, getting, updating, and deleting nail items.
-   Utilize Vitest for the test runner and mocking Firebase SDK as needed (e.g., `vi.mock('firebase/firestore')`).
-   Aim for good coverage of the `firestore.ts` helper functions.
-   Keep the diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` and ensure all new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to add comprehensive unit tests for the helper functions defined in `src/lib/firestore.ts`.

1.  **Create Test File**: Create a new file `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` to mock `firebase/firestore` and any other Firebase SDK modules necessary to isolate `src/lib/firestore.ts` functions for testing. This is crucial for unit tests.
3.  **Test CRUD Operations**: Focus on testing functions that perform CRUD (Create, Read, Update, Delete) operations on the `nailItems` collection.
4.  **Test Edge Cases**: Consider testing edge cases such as empty inputs, invalid IDs, and error scenarios (e.g., Firebase throwing an error).
5.  **No New Dependencies**: Ensure you do not add any new npm packages to `package.json`. Vitest is specified as the test runner in the roadmap and is assumed to be available. If `npm test` does not work due to missing Vitest setup, report this as a blocker.
6.  **Run Tests**: Execute `npm test` to confirm your new tests pass.
7.  **Lint and Build**: Run `npm run lint` and `npm run build` to ensure no new errors are introduced.

Upon completion, provide the required output in Markdown format following the template.

**Acceptance Criteria:**
-   A new file `src/__tests__/lib/firestore.test.ts` exists.
-   Key helper functions in `src/lib/firestore.ts` have corresponding unit tests.
-   Firebase SDK interactions are mocked effectively.
-   All new tests pass when `npm test` is run.
-   No new npm dependencies are added.
-   The changes result in a diff of 150 lines or less.

**Required test commands:**
```bash
npm test
npm run build
npm run lint
```
