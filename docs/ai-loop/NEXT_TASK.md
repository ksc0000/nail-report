# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically targets enhancing test coverage by adding unit tests for core Firebase helper functions. Vitest is designated as the test runner, and Firebase SDK mocking will be required.

## Objective

Add Vitest unit tests for the `getNailItems` function within `src/lib/firestore.ts`, including the necessary Firebase Firestore SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize minimal changes)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, but prefer `vi.mock` in test file)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Implement the following steps:

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Configure Vitest and Mock Firebase**:
    *   Within `src/__tests__/lib/firestore.test.ts`, use `vi.mock` to mock the `@firebase/firestore` module.
    *   Focus on mocking the necessary Firestore functions (`collection`, `query`, `getDocs`, `orderBy`, `where`, `doc`, `getDoc`, `updateDoc`, `setDoc`, `deleteDoc`, `query`, `limit`) that `getNailItems` might directly or indirectly use. Initially, mock `getDocs` to return a predictable set of mock documents.
3.  **Write unit tests for `getNailItems`**:
    *   Write at least one test case for `getNailItems` that verifies it correctly fetches and processes nail items for a given user ID.
    *   Ensure the test asserts on the structure and content of the returned data, based on the mocked Firestore response.
    *   Consider a test case for an empty collection.
    *   The `getNailItems` function typically expects a `userId` as an argument.
4.  **Ensure minimal changes to `src/lib/firestore.ts`**: Only modify `firestore.ts` if strictly necessary to make functions testable (e.g., exporting a non-exported helper). Avoid any logic changes.
5.  **Verify**: Run `npm test` to ensure the new tests pass. Then, run `npm run build && npm run lint` to confirm code quality and build integrity.

**Acceptance Criteria:**

- A new test file `src/__tests__/lib/firestore.test.ts` exists.
- The Firebase Firestore SDK is appropriately mocked using `vi.mock`.
- At least one passing unit test for the `getNailItems` function is present in `firestore.test.ts`.
- The `npm test` command runs successfully with the new tests.
- The `npm run build && npm run lint` commands complete without errors.
