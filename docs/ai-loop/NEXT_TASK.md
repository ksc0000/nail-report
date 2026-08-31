docs/ai-loop/NEXT_TASK.md
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current sub-phase (2.1) is dedicated to increasing test coverage, specifically starting with unit tests for core helper functions.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest and mock Firebase SDK dependencies.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a test file)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `package.json` (only to update `scripts` for `test` command if necessary to run Vitest, *not* to add new `dependencies` or `devDependencies`)
-   `vite.config.ts` (if Vitest config needs slight adjustment for mocking, but prioritize `vi.mock` in tests)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` `dependencies` or `devDependencies` (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for minimal `package.json` adjustments related to `test` script.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add a new test file `src/__tests__/firestore.test.ts`.
-   Identify at least 2-3 helper functions in `src/lib/firestore.ts` that can be unit tested (e.g., functions for adding, updating, fetching, or deleting nail items/public shares).
-   Write at least one unit test for each identified function, covering a success scenario.
-   Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) to ensure tests are isolated and do not interact with actual Firebase services.
-   Ensure tests can be executed successfully using `npm test`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

## Worker prompt

Jules, your task is to add initial unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a new test file**: In `src/__tests__`, create a new file named `firestore.test.ts`.
2.  **Identify functions to test**: Examine `src/lib/firestore.ts` and identify at least 2-3 functions that perform CRUD operations or data retrieval on Firestore (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getPublicShare`).
3.  **Mock Firebase SDK**: Within `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the necessary Firebase modules (e.g., `firebase/firestore`). Mock functions like `addDoc`, `getDocs`, `updateDoc`, `deleteDoc` to return predefined values or throw errors as needed for your test cases.
4.  **Write unit tests**:
    *   For each identified function, write at least one `describe` block.
    *   Inside each `describe` block, write at least one `test` or `it` block to test a successful execution path.
    *   Assert that the helper function correctly interacts with the mocked Firebase SDK functions and returns the expected result.
    *   Focus on isolated unit testing; do not write integration tests.
5.  **Run tests**: Verify that `npm test` successfully executes your new tests. If `npm test` is not configured, attempt to add a minimal script to `package.json` to run `vitest` (e.g., `"test": "vitest"`), *without* adding `vitest` as a new dependency. If Vitest is not installed, report this as a blocker.
6.  **Lint and Build**: Ensure the project still builds and passes lint checks.

This task is focused on establishing the testing pattern for `src/lib/` files. Do not add complex error handling tests or extensive edge cases beyond simple success paths at this stage. Report any necessary follow-up tasks (e.g., "add error path tests for X function") as comments in your final report.
