```markdown
# Worker Prompt Template

## Context

The application needs improved test coverage, specifically for Firebase helper functions. This task focuses on adding unit tests for `src/lib/firestore.ts`. Vitest is the chosen test runner, and Firebase SDK mocking should be used.

## Objective

Add Vitest unit tests for at least two helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes for testability if absolutely necessary, but prioritize testing existing API)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest setup is explicitly missing or needs a minor adjustment for test file discovery)

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

## Worker Prompt

Your task is to implement unit tests for helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Add Vitest tests:**
    *   Identify at least two helper functions in `src/lib/firestore.ts` that interact with Firestore (e.g., `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`).
    *   Write unit tests for these two functions.
    *   **Crucially, mock the Firebase SDK** using `vi.mock('firebase/firestore')` to control its behavior and ensure tests are isolated. Do not make actual calls to Firebase.
    *   Verify that the functions correctly call the mocked Firebase methods with the expected arguments and handle their responses.
3.  **Run tests:** Execute `npm test` to ensure all new and existing tests pass.
4.  **Run build and lint:** Ensure `npm run build && npm run lint` completes without errors or warnings.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` is created.
*   At least two helper functions from `src/lib/firestore.ts` have dedicated unit tests.
*   Firebase Firestore SDK calls (`getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, etc.) are mocked in the tests.
*   All tests pass when running `npm test`.
*   `npm run build` and `npm run lint` execute successfully.
```
