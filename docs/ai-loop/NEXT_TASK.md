# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions, as outlined in Phase 2.1 of the roadmap.

## Objective

Implement unit tests for the `addNailItem` function in `src/lib/firestore.ts` using Vitest. This involves mocking Firebase Firestore SDK interactions to test the function in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes allowed for testability, if absolutely necessary)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `package.json` (only if adding a Vitest script to run tests, do NOT add new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (do NOT add new npm packages; Vitest is assumed to be configured and installed)
- Firebase deploy commands
- Secrets and credentials
- Any files not explicitly listed in Allowed Scope

## Requirements

- Keep the overall diff for this PR ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the `addNailItem` function located in `src/lib/firestore.ts`.

1.  **Create a new file**: `src/__tests__/firestore.test.ts`.
2.  **Import necessary functions**: From `src/lib/firestore.ts` and relevant Firebase Firestore modules (e.g., `getFirestore`, `collection`, `addDoc`).
3.  **Mock Firebase Firestore SDK**: Use `vitest.mock` to mock the `firebase/firestore` module. Specifically, mock the functions `getFirestore`, `collection`, and `addDoc` to prevent actual Firebase calls during tests.
    *   The mock for `addDoc` should simulate a successful document addition, returning an object with an `id` property (e.g., `{ id: 'test-id-123' }`).
    *   Ensure the mock setup correctly handles the chaining of calls (e.g., `getFirestore()`, then `collection(db, 'nailItems')`, then `addDoc(collectionRef, data)`).
4.  **Write tests for `addNailItem`**:
    *   Test a successful call to `addNailItem` with valid data. Assert that `addDoc` was called with the correct arguments (collection reference and item data).
    *   Test error handling if `addDoc` throws an error. Assert that the error is caught and potentially re-thrown or handled as expected.
5.  **Ensure testability**: If `addNailItem` requires *minimal* refactoring to be more testable (e.g., making a dependency injectable), you may make small, targeted changes to `src/lib/firestore.ts`. However, prioritize mocking over refactoring if the latter significantly increases complexity or diff size.
6.  **Run checks**: Execute the required test commands as listed below.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` is created.
- The `addNailItem` function from `src/lib/firestore.ts` is unit tested.
- Firebase Firestore SDK interactions (`getFirestore`, `collection`, `addDoc`) are properly mocked using Vitest.
- Tests verify successful item addition and error handling.
- All tests pass (`npm test`).
- The project builds successfully (`npm run build`).
- Linting checks pass (`npm run lint`).
- The total line diff for the PR is 150 lines or less.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```

**Potential Blockers / Known Issues:**
