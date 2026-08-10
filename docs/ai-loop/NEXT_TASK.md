# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This is the first substantive task for this phase. The roadmap explicitly calls for adding unit tests using Vitest and mocking Firebase SDK.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task aims to improve test coverage as per Phase 2.1 of the roadmap.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if necessary, but focus on testing existing logic)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (only to add `test` script or `vitest` config if strictly necessary and within constraints, but `vitest` should already be configured for testing)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker prompt

Implement unit tests for the functions defined in `src/lib/firestore.ts`.

### Specifics

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Use Vitest**: Write tests using Vitest syntax.
3.  **Mock Firebase SDK**: Utilize `vi.mock` to mock Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc.) to isolate the `firestore.ts` logic. Do not make actual network calls to Firebase.
4.  **Cover key functions**: Focus on testing the primary CRUD operations and data retrieval functions like `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, and `getPublicShare`.
5.  **Test success and error paths**: Ensure tests cover both successful execution and potential error scenarios (e.g., when Firestore operations fail). Mock Firebase functions to simulate these error conditions.
6.  **Avoid new npm dependencies**: Do not add any new packages to `package.json`. Vitest should already be available and configured.
7.  **Ensure tests pass**: Run the tests to confirm they pass.

### Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` exists.
-   This file contains unit tests for the major functions in `src/lib/firestore.ts`.
-   Firebase Firestore SDK functions are properly mocked using `vi.mock`.
-   The tests cover both successful and error conditions for the tested functions.
-   All tests pass.

### Required Test Commands

```bash
npm test
npm run build
npm run lint
```
