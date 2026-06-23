# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, with a focus on improving stability, test coverage, and user experience. This task directly addresses the "2.1 Test coverage" goal by introducing unit tests for fundamental Firebase Firestore helper functions.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` functions located within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but ideally none)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration for mocking needs adjustment, unlikely)
- `package.json` (only for adding or modifying `test` script, not for new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Ensure the tests effectively use `vi.mock` to mock Firebase Firestore SDK functions (`getFirestore`, `collection`, `addDoc`, `getDocs`, etc.).
- Cover both successful execution and error handling scenarios for the targeted functions.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add unit tests for two core functions, `addNailItem` and `getNailItems`, found in `src/lib/firestore.ts`.

1.  **Create a new test file**: In `src/__tests__/lib/`, create a new file named `firestore.test.ts`.
2.  **Set up Firebase mocking**: Within `firestore.test.ts`, use `vi.mock` to mock the necessary Firebase Firestore SDK modules and functions. This includes mocking `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, and `orderBy` as they are used by the target functions. Ensure that mock implementations return predictable values or throw errors when testing error paths.
3.  **Test `addNailItem`**:
    *   Write a test case that verifies `addNailItem` successfully calls `addDoc` with the correct `collection` path and the provided `nailItem` data.
    *   Add a test case that simulates an error during the `addDoc` call and asserts that `addNailItem` handles this error gracefully (e.g., throws it further or logs it as appropriate per existing function logic).
4.  **Test `getNailItems`**:
    *   Write a test case that verifies `getNailItems` successfully calls `getDocs` on the correct `collection` and returns the expected structured data. Ensure user ID filtering is implicitly or explicitly covered if applicable to the function's signature.
    *   Add a test case that simulates an error during the `getDocs` call and asserts that `getNailItems` handles this error.
5.  **Run Tests**: Execute `npm run test` to confirm all new tests pass.
6.  **Lint and Build**: Ensure the project still builds and passes lint checks by running `npm run build && npm run lint`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
