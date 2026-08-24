# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task targets `Phase 2.1 Test coverage` by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer not to alter core logic)
- `src/lib/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (if basic configuration is needed for mocks, e.g., `setupFiles`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/lib/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`. Examples include `addNailItem`, `updateNailItem`, `deleteNailItem`, or any other clearly defined helper.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vitest`'s `vi.mock` to isolate the functions under test.
- Ensure the tests assert expected behavior for both successful operations and potential error cases.
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

### Worker prompt

```markdown
# Worker Prompt

## Context

The current objective is to improve the test coverage of the `nail-report` application, specifically focusing on the core Firebase helper functions. `src/lib/firestore.ts` contains crucial functions for interacting with the Firestore database.

## Task

Your task is to implement unit tests for the `src/lib/firestore.ts` helper functions using Vitest.

1.  **Create a new test file**: Add `src/lib/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` to mock `firebase/firestore` functions (e.g., `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`, etc.) to control their behavior and simulate Firestore responses without actual Firebase calls.
3.  **Write Unit Tests**:
    *   Choose at least two clearly defined helper functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `subscribeToNailItems`, etc.).
    *   Write test cases to cover the main success path for each chosen function.
    *   Consider adding at least one test case to verify error handling for a chosen function (e.g., what happens if `addDoc` rejects).
4.  **Assertions**: Use Vitest's assertion library (`expect`) to verify that the functions behave as expected, e.g., that mock functions were called with the correct arguments, or that the function returns the expected value.

## Acceptance Criteria

-   A new file `src/lib/__tests__/firestore.test.ts` exists.
-   This file contains `vi.mock` definitions for `firebase/firestore` to allow isolated testing.
-   At least two helper functions from `src/lib/firestore.ts` have comprehensive unit tests covering success and basic error scenarios.
-   `npm test` runs successfully with the new tests passing.
-   The changes result in a diff of ≤ 150 lines.

## Required Test Commands

```bash
npm test
npm run build && npm run lint
```
```
