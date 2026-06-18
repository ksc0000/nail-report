# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. The current objective is to enhance test coverage for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/utils.ts` (new file for Firebase mock setup, if needed)
- `src/App.css` (no changes expected for this task)

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
- Focus on testing the core CRUD helper functions like `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, and any other relevant functions in `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies as needed using `vitest` and `vi.mock`.
- Run `npm run test` to ensure tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to add unit tests for the functions in `src/lib/firestore.ts`.

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Inside `firestore.test.ts`, write tests for the public helper functions exported from `src/lib/firestore.ts`.
    *   Examples of functions to test include `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, `updatePublicShare`, and `deletePublicShare`.
3.  Use Vitest's mocking capabilities (`vi.mock`) to mock the Firebase Firestore SDK to ensure tests are isolated and do not interact with actual Firebase services. You may need to create a small utility file (e.g., `src/__tests__/utils.ts`) for common Firebase mocks if necessary.
4.  Ensure that the tests cover typical success cases and basic error handling scenarios.
5.  If any functions in `src/lib/firestore.ts` are not exported but need to be tested, modify `src/lib/firestore.ts` to export them temporarily for testing purposes. Revert these changes if they make the module's public API messy. Prefer testing through the public API.
6.  Before submitting, ensure all tests pass by running `npm run test`.
7.  Verify the project builds and lints cleanly by running `npm run build && npm run lint`.

Remember to keep the PR focused and small (aim for ≤150 lines of diff). If mocking Firebase proves too complex for a single PR, focus on a subset of functions and note the complexity in your report.
