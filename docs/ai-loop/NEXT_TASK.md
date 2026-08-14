# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The goal is to begin adding unit tests for core Firebase helper functions.

## Objective

Implement initial unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, focusing on a few core CRUD operations for nail items and public shares.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, but primarily adding tests for it)
-   `src/__tests__/firestore.test.ts` (new file for tests)

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

## Worker Prompt

Your task is to create a new test file, `src/__tests__/firestore.test.ts`, and add unit tests for a selected set of functions in `src/lib/firestore.ts`.

1.  **Create Test File**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock('firebase/firestore')` at the top of your test file to mock Firestore functions. You will need to mock functions like `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc` etc., as they are used by the helper functions in `src/lib/firestore.ts`.
3.  **Implement Tests**: Write unit tests for the following functions from `src/lib/firestore.ts`:
    *   `getNailItems`: Test its ability to fetch items correctly.
    *   `addNailItem`: Test if it correctly calls the underlying Firestore `addDoc` function with the provided data.
    *   `deleteNailItem`: Test if it correctly calls the underlying Firestore `deleteDoc` function.
    *   `getPublicShare`: Test its ability to fetch a public share by ID.
4.  **Assertions**: Ensure your tests use Vitest's assertion library (`expect`) to verify the expected behavior of the functions and the correct interaction with the mocked Firebase SDK.
5.  **Clean Up Mocks**: Use `vi.clearAllMocks()` or `vi.restoreAllMocks()` in `beforeEach` or `afterEach` hooks as appropriate to ensure test isolation.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists.
*   The new file contains at least one test suite for `src/lib/firestore.ts`.
*   Tests are implemented for `getNailItems`, `addNailItem`, `deleteNailItem`, and `getPublicShare`.
*   Firebase Firestore SDK functions are properly mocked using `vi.mock`.
*   All tests pass successfully.

**Required Test Commands:**

```bash
npm test
npm run build && npm run lint
```
