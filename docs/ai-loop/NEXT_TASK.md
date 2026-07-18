# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for core application logic.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for minor, non-breaking adjustments to improve testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file)

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

## Worker prompt

### Task: Implement Vitest Unit Tests for `src/lib/firestore.ts`

**Detailed Instructions:**

1.  **Create a New Test File:** Create a new file named `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Within `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the Firebase SDK dependencies (e.g., `firebase/firestore`) that `src/lib/firestore.ts` relies on. Ensure that the mock provides appropriate stubbed return values for Firestore operations.
3.  **Write Unit Tests:** Implement unit tests for at least two core helper functions from `src/lib/firestore.ts`. Focus on functions that interact directly with Firestore, such as `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
    *   Cover both successful execution paths and potential error scenarios (if error handling logic exists within the `firestore.ts` functions).
    *   Verify that the mocked Firestore methods are called with the correct arguments.
    *   Verify that the functions return the expected data or throw expected errors.
4.  **Verify Tests:** Run the tests to ensure they pass.
5.  **Lint and Build:** Ensure the project lints and builds successfully.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists.
*   The test file includes `vi.mock` setups for Firebase SDK dependencies.
*   At least two core functions from `src/lib/firestore.ts` are covered by unit tests.
*   Tests verify function behavior, including interactions with mocked Firestore, and handle successful and error paths where applicable.

**Required Test Commands:**

```bash
npm test
npm run build && npm run lint
```
