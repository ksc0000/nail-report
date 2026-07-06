# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for critical helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only for adding test scripts if not already present, but Vitest should be configured)
- `vite.config.ts` (if Vitest configuration is needed, though it should largely be set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Implement unit tests for the functions defined in `src/lib/firestore.ts`. This involves:

1.  **Setting up a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mocking Firebase SDK**: Use `vitest` and `vi.mock` to mock Firebase Firestore SDK interactions. Ensure that actual Firebase calls are not made during unit tests. Mock `getFirestore` and any other Firebase methods used by the `firestore.ts` helpers.
3.  **Writing test cases**: For each significant function in `src/lib/firestore.ts` (e.g., functions for adding, getting, updating, deleting nail items or public shares), write at least one positive test case and one error/edge case test case. Focus on the logic within the helper functions themselves, not the Firebase integration details which are mocked.
4.  **Ensuring test isolation**: Each test should be independent and not rely on the state of other tests.
5.  **Refactoring for testability (if necessary and minimal)**: If any functions are not easily testable, make minimal, non-breaking changes to `src/lib/firestore.ts` to improve their testability (e.g., exporting internal helpers, or ensuring dependencies are injectable, though mocking should be sufficient).
6.  **Run tests**: Verify all new tests pass using `npm test` or `vitest`.

## Acceptance criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- This file contains unit tests for all primary functions in `src/lib/firestore.ts`.
- Firebase SDK calls are appropriately mocked using `vi.mock`.
- All new tests pass successfully.
- Code diff is within the 150-line limit.

## Required test commands

```bash
npm run build && npm run lint
npm test # or npx vitest
```

## Known issues or limitations

- No known issues. Focus on isolated unit tests for the helper logic, not integration tests with actual Firestore.

## Suggested next task

Add `aria-label` to all icon-only buttons in the application.
