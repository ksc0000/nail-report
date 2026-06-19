```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/` (new test files for `firestore.ts`)
- `src/vitest.setup.ts` (if global mocks are needed, but prefer local mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using Vitest's mocking capabilities.
- Cover key helper functions in `src/lib/firestore.ts` with basic unit tests (e.g., creating, reading, updating, deleting nail items, or any other significant helpers).
- Run `npm run build && npm run lint && npm run test` before finishing.
- Ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to add unit tests for the functions in `src/lib/firestore.ts`.
You will need to:
1.  Create a new test file at `src/__tests__/firestore.test.ts`.
2.  Import `vitest` and the functions from `src/lib/firestore.ts`.
3.  Use `vi.mock` to mock Firebase dependencies (e.g., `firebase/firestore`) to isolate the `firestore.ts` functions for testing.
4.  Write unit tests for at least two significant helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`). Focus on testing the logic of the helper functions, not the Firebase SDK itself.
5.  Ensure the tests cover success and basic error cases where applicable within the helper's logic.
6.  Do not modify the production code (`src/lib/firestore.ts`) unless absolutely necessary for testability, and keep such modifications minimal.
7.  Verify all tests pass by running `npm run test`.
8.  Run `npm run build` and `npm run lint` to confirm no build or linting issues are introduced.
```
