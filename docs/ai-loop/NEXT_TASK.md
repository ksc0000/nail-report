```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1, "Test coverage," is active, with a specific goal to add unit tests for Firestore helper functions using Vitest. The current state shows no active work on this specific task, and Vitest is listed as the chosen test runner. This task focuses on beginning test coverage for the core Firestore interaction logic.

## Objective

Implement Vitest unit tests for a subset of the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability)
- `src/__tests__/firestore.test.ts` (new file)
- `src/__tests__/` (any other new test files related to `firestore.ts` if deemed necessary)
- `vite.config.ts` (if minor Vitest config adjustment is *strictly* necessary for mocking, but prefer to mock within tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest should be an existing dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two significant helper functions within `src/lib/firestore.ts`. Focus on functions that interact with Firestore (e.g., `addDoc`, `getDoc`, `updateDoc`, `deleteDoc` wrappers).
- Utilize `vitest` for writing tests.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) where necessary to isolate the functions under test.
- Ensure the tests are passing.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
- Report any blocking issues (e.g., Vitest not being set up) as comments.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to add initial unit test coverage for the Firestore helper functions.

1.  **Create Test File**: Create a new file named `src/__tests__/firestore.test.ts`.
2.  **Identify Helpers**: Review `src/lib/firestore.ts` to identify key helper functions that abstract Firebase Firestore operations.
3.  **Implement Tests**:
    *   Choose at least two distinct helper functions (e.g., for adding data, retrieving data, or updating data).
    *   Write unit tests for these functions using Vitest's `describe` and `it` blocks.
    *   Crucially, mock the `firebase/firestore` module and any other Firebase SDK dependencies to ensure tests are isolated and do not interact with actual Firebase services. Use `vi.mock()` for this.
    *   Ensure your tests cover successful execution paths and, if straightforward, basic error handling (e.g., what happens if an underlying Firestore call fails).
4.  **Verify**:
    *   Run `npm run test` and ensure all new tests pass.
    *   Run `npm run build` and `npm run lint` to confirm no build or linting errors are introduced.
5.  **Review**: Ensure the changes are contained within the allowed scope and the diff size is minimal (ideally under 150 lines).

Focus on getting a foundational set of tests in place, rather than comprehensive coverage of every single edge case for all functions in this first pass.
```
