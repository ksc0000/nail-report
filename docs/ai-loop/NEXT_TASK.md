# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current focus within Phase 2 is "2.1 Test coverage," which explicitly mentions unit tests for Firestore helper functions. This task directly addresses that goal by starting to add tests for the core data access layer.

## Objective

Add Vitest and unit tests for the `addNailItem` and `getNailItems` helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors to improve testability)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if `vitest` or testing-library/react are not already dev dependencies and needed for the task, but prefer to assume they are installed as per roadmap)
- `vite.config.ts` (minimal configuration for Vitest if absolutely necessary, but assume base Vitest setup is complete)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no *new* npm packages without human approval; modifying existing version ranges is okay)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files (this task's core objective is adding tests).
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Create Test File**: Create a new test file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use Vitest's mocking capabilities (`vi.mock('firebase/firestore')`) to mock the Firebase Firestore SDK functions (`addDoc`, `getDocs`, `collection`, `query`, `where`, `orderBy`, etc.) that `src/lib/firestore.ts` interacts with. Do not make actual calls to Firebase during tests.
3.  **Test `addNailItem`**: Write unit tests for the `addNailItem` function in `src/lib/firestore.ts`.
    *   Verify that `addDoc` is called with the correct `collection` reference and data.
    *   Handle successful and potential error scenarios (e.g., if `addDoc` throws an error).
4.  **Test `getNailItems`**: Write unit tests for the `getNailItems` function in `src/lib/firestore.ts`.
    *   Verify that `collection`, `query`, `where` (for `userId`), and `orderBy` are called correctly.
    *   Mock the return value of `getDocs` to simulate a list of nail items and assert that `getNailItems` returns the expected structured data.
    *   Handle scenarios where no items are returned or `getDocs` throws an error.
5.  **Refine `src/lib/firestore.ts` (if needed)**: Make minor adjustments to `src/lib/firestore.ts` only if absolutely necessary to make the functions testable (e.g., exporting previously unexported helpers, or small dependency injection modifications). Keep such changes minimal.
6.  **Run Tests**: Ensure the newly added tests pass successfully using `npm test` (or `vitest`).

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains at least one passing unit test for `addNailItem`.
- This file contains at least one passing unit test for `getNailItems`.
- Firebase SDK functions are mocked, and no actual Firestore calls are made during test execution.
- `npm run build` and `npm run lint` pass without errors.

## Required test commands

```bash
npm test
npm run build
npm run lint
```

## Suggested next task

Add Vitest unit tests for the `updateNailItem` and `deleteNailItem` functions in `src/lib/firestore.ts`.
