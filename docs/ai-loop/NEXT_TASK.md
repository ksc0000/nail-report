# Worker Prompt Template

## Context

The product roadmap for `nail-report` is actively in Phase 2, focusing on improving stability, test coverage, and UX. A key area for improvement is adding comprehensive unit tests for core helper functions, starting with Firestore operations. This task aims to establish unit testing for one of the Firestore helper functions using Vitest.

## Objective

Implement unit tests for the `getNailItems` function located in `src/lib/firestore.ts` using Vitest. This involves setting up the test file, mocking necessary Firebase SDK modules, and writing tests to verify the function's behavior, including successful data retrieval and basic error handling.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if needed, but primarily test *against* it)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is not complete for this scope)

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

---

## Worker Prompt

Your task is to add unit tests for the `getNailItems` function within `src/lib/firestore.ts`.

1.  **Ensure Vitest Setup**: Verify that Vitest is configured to run tests within `src/lib` and `src/__tests__`. If `vite.config.ts` needs minor adjustments to include `src/__tests__` in its test runner configuration, make those.
2.  **Create Test File**: Create a new test file at `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK**: Utilize `vi.mock` to mock the `firebase/firestore` module and its relevant functions (e.g., `collection`, `query`, `getDocs`, `onSnapshot` depending on `getNailItems` implementation). Focus on mocking what `getNailItems` directly uses.
4.  **Implement Tests for `getNailItems`**:
    *   Write a test case to ensure `getNailItems` correctly fetches and transforms a list of nail items when the underlying Firebase call succeeds.
    *   Write a test case to verify how `getNailItems` handles an error or empty result from the Firebase SDK (e.g., ensuring it returns an empty array or throws an expected error).
    *   If `getNailItems` uses `onSnapshot` for real-time updates, ensure to test its subscription and unsubscription mechanisms. If it's a one-time `getDocs` call, focus on that.
5.  **Verify Calls**: Use Vitest's `toHaveBeenCalledWith` or similar matchers to assert that `firebase/firestore` functions are called with the correct arguments.

**Acceptance Criteria:**

- A new file `src/__tests__/firestore.test.ts` exists.
- This new file contains at least two distinct test cases for the `getNailItems` function.
- The tests mock the `firebase/firestore` module correctly to isolate the `getNailItems` logic.
- All tests pass when running `npm test`.

**Required Test Commands:**

```bash
npm test
npm run build
npm run lint
```
