```markdown
# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task will contribute to the "Test coverage" objective by adding unit tests for a core Firebase utility function.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments needed for testability, e.g., exporting unexported functions if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/__mocks__/firebase.ts` (new file for Firebase SDK mocks, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or folders outside of the explicitly allowed scope.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to enable isolated unit testing.
- Write tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`). Focus on testing success paths and basic error handling where applicable.
- Ensure the tests run successfully using Vitest.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` utility file.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** You will need to mock Firebase Firestore (and potentially Auth, if `firestore.ts` directly depends on it for user ID) to perform isolated unit tests. You can create a mock file in `src/__tests__/__mocks__/firebase.ts` or directly mock using `vi.mock()` in your test file. Focus on mocking the `firestore` module's behavior (e.g., `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`).
3.  **Write Tests:** Implement unit tests for at least two core CRUD functions within `src/lib/firestore.ts`. Consider functions like `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
    *   Test the successful execution of these functions.
    *   Consider a basic test case for error handling if the functions include try/catch blocks or return error states.
    *   Use `expect` assertions to verify that the mocked Firebase methods were called correctly and that the functions return the expected results.
4.  **Verify:**
    *   Run `npm test` to ensure your new tests pass.
    *   Run `npm run build` to check for build errors.
    *   Run `npm run lint` to check for linting issues.
    *   Ensure the total diff size is within 150 lines.

This task is focused solely on adding the test coverage for `firestore.ts`. Do not refactor `firestore.ts` unless absolutely necessary to make a function testable (e.g., exporting a helper).

---

## Summary of what changed

_\[Worker will fill this out]_

## Changed files list

_\[Worker will fill this out]_

## Commands run and results

_\[Worker will fill this out]_

## Known issues or limitations

_\[Worker will fill this out]_

## Suggested next task

_\[Worker will fill this out]_
```
