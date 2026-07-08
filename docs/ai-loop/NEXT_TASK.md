# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses Phase 2.1 (Test coverage) by adding foundational unit tests for Firebase helper functions.

## Objective

Implement initial unit tests for key helper functions in `src/lib/firestore.ts` using Vitest, specifically focusing on the `addNailItem` and `deleteNailItem` operations.

## Allowed Scope

- `src/lib/firestore.ts` (read-only for understanding the functions to test)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (read-only to confirm `vitest` is available)
- `vite.config.ts` (read-only to confirm Vitest setup if needed, but no modifications)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other CSS files

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use `vitest` for testing.
- Mock Firebase SDK (Firestore) dependencies as needed for isolated unit tests, utilizing `vi.mock`.
- Ensure tests are clean, isolated, and pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

1.  **Verify Vitest Setup:** Check `package.json` for `vitest` in `devDependencies`. Assume Vitest is configured and ready to use for running tests (e.g., via `npm test` or `npm run test`). If `vitest` is not present, report this as a blocking issue.
2.  **Inspect `firestore.ts`:** Carefully read `src/lib/firestore.ts` to understand how `addNailItem` and `deleteNailItem` interact with the Firebase Firestore SDK.
3.  **Create Test File:** Create a new file named `src/__tests__/firestore.test.ts`.
4.  **Mock Firebase Firestore:**
    *   Set up `vi.mock('firebase/firestore')` at the top of your test file to mock Firestore functions.
    *   Mock the specific Firestore functions that `addNailItem` and `deleteNailItem` call (e.g., `collection`, `doc`, `addDoc`, `deleteDoc`).
    *   Ensure the mocks allow you to verify that the functions are called with the correct arguments.
5.  **Test `addNailItem`:**
    *   Write a unit test case for `addNailItem`.
    *   Assert that `addDoc` (or equivalent Firestore method) is called exactly once with the expected `collection` reference and `nailItem` data.
    *   Consider testing successful execution.
6.  **Test `deleteNailItem`:**
    *   Write a unit test case for `deleteNailItem`.
    *   Assert that `deleteDoc` (or equivalent Firestore method) is called exactly once with the expected `doc` reference constructed from the provided `itemId` and `userId`.
    *   Consider testing successful execution.
7.  **Run Tests:** Execute `npm test` (or `npm run test`) and ensure all new tests pass.
8.  **Final Checks:** Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.

This task specifically focuses on adding initial tests for two core CRUD operations. Error handling or edge cases for these functions are not required in this task to keep the diff small.
