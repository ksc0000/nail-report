```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core helper functions.

## Objective

Implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`. Focus on testing basic CRUD operations or utility functions within that file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize minimal changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if necessary to configure test environment for Firebase mocks)
- Existing mock files (if any) or new mock files within `src/__mocks__` or `src/__tests__/__mocks__` for Firebase SDK.

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other styling files
- Any other files not explicitly mentioned in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK (Firestore specifically) using `vitest` and `vi.mock` to ensure tests are isolated and do not interact with a live Firebase project.
- Cover at least two significant helper functions in `src/lib/firestore.ts` with unit tests.
- Ensure tests assert expected behavior for both success and potential error cases (if applicable to the functions chosen).
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Within this file, use `vi.mock` to mock the Firebase Firestore SDK methods that `src/lib/firestore.ts` interacts with. This will prevent actual calls to Firebase during tests.
3.  Identify at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) and write unit tests for them.
4.  For each function, write tests that cover:
    *   Successful execution with valid data.
    *   (Optional but recommended) Edge cases or error conditions if the function handles them.
5.  Ensure your mock implementations return predictable values or throw errors as appropriate for the test scenarios.
6.  Verify all existing tests still pass and the new tests pass.
7.  Run `npm run build && npm run lint` to ensure code quality.
```
