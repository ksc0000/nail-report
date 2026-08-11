```markdown
# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. The immediate goal is to improve test coverage, starting with core utility functions. This task specifically targets adding unit tests for Firestore helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor adjustments are needed for Firebase mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` for the unit tests.
- Focus on testing the public helper functions exported from `src/lib/firestore.ts`.
- Utilize Vitest's mocking capabilities (e.g., `vi.mock`) to mock Firebase SDK dependencies (Firestore, Auth, etc.) to ensure tests are isolated and run without actual Firebase calls.
- Write tests that cover typical use cases for each helper function.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add comprehensive unit tests for the functions within `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest mocking:** Configure Vitest to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) within `firestore.test.ts` to ensure tests are self-contained and don't hit actual Firebase services. Refer to existing test setups or Vitest documentation for mocking Firebase.
3.  **Implement tests for `src/lib/firestore.ts` helpers:**
    *   Identify all exported helper functions in `src/lib/firestore.ts` (e.g., functions for adding, updating, deleting nail items, or fetching data).
    *   For each function, write one or more unit tests to verify its correct behavior, including success cases and potential error handling.
    *   Ensure that mock data and mock return values accurately simulate Firebase responses.
4.  **Verify test execution:** Run the tests to ensure they pass.
5.  **Lint and build:** Run `npm run lint` and `npm run build` to ensure no linting errors or build issues are introduced.

**Acceptance Criteria:**
*   A new file `src/__tests__/firestore.test.ts` exists.
*   The `src/__tests__/firestore.test.ts` file contains unit tests for the exported functions in `src/lib/firestore.ts`.
*   Firebase SDK is properly mocked within the tests to prevent actual network calls.
*   All new tests pass.
*   `npm run build` completes successfully.
*   `npm run lint` passes without errors or warnings.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
```
