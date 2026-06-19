# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets increasing test coverage, starting with helper functions. This task addresses the first item in the "Jules-ready Tasks" list, focusing on test coverage for Firestore utilities.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. These tests should mock Firebase SDK interactions to ensure functionality is tested in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (for understanding the functions to be tested, no functional changes unless absolutely necessary for testability, and even then, minimal).
- `src/__tests__/firestore.test.ts` (new file for the unit tests).
- `vite.config.ts` (if minor Vitest configuration is needed, e.g., for mock paths).
- `package.json` (ONLY if Vitest is not already in `devDependencies`; if so, add it as a `devDependency`. Otherwise, no changes to `package.json`).

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- Firebase deploy commands
- Secrets and credentials
- Adding any new npm packages beyond Vitest itself (if it's not already installed)

## Requirements

- Keep the overall diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` or similar Vitest mocking capabilities.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts` that interact with Firestore (e.g., functions for fetching all nail items, adding a new nail item, or updating an existing one).
- Ensure tests verify that the functions correctly call the mocked Firebase APIs with the expected arguments and handle return values as expected.
- Run `npm run build && npm run lint` before finishing.
- If the `vitest` command is not available and Vitest is not in `devDependencies`, add it as a `devDependency` and report this change. Otherwise, assume Vitest is ready for use.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

1.  **Check Vitest Installation**: Verify if Vitest is listed in `devDependencies` in `package.json`. If not, install it by running `npm install -D vitest`. If you need to do this, report it in the "Changed files list" and "Commands run" sections.
2.  **Create Test File**: Create a new file `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase Firestore SDK**: In `src/__tests__/firestore.test.ts`, set up mocks for the necessary Firebase Firestore SDK functions that `src/lib/firestore.ts` interacts with. Focus on mocking the lowest-level interactions (e.g., `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`) and the `getFirestore`, `collection`, `doc` chain.
4.  **Identify Functions to Test**: Review `src/lib/firestore.ts` and identify at least two core helper functions that perform CRUD operations on nail items or related data in Firestore. Examples might include functions like `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, or similar.
5.  **Write Unit Tests**: For each identified function, write one or more unit tests in `src/__tests__/firestore.test.ts`:
    *   Test that the function calls the correct mocked Firebase Firestore APIs.
    *   Test that the function passes the correct arguments to these APIs.
    *   Test that the function correctly processes and returns data based on mocked Firebase responses.
    *   Include tests for both successful and potential error paths if applicable (e.g., `try-catch` blocks in the original function).
6.  **Run Tests**: Execute the tests locally using `npm test` or `vitest`. Ensure all new tests pass.
7.  **Lint and Build**: Run `npm run lint` and `npm run build` to verify no new issues are introduced.
8.  **Report**: Summarize your changes, list all modified files, document commands run and their results, and note any limitations or suggestions.
