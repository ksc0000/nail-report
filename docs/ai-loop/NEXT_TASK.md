# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-point for Phase 2 is "2.1 Test coverage", specifically mentioning "Unit tests for Firestore helper functions (`src/lib/firestore.ts`)". This task aims to kickstart the test coverage efforts by implementing unit tests for the core Firestore utility functions.

## Objective

Add unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest, focusing on mocking the Firebase SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize minimal changes)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (minor additions for Vitest setup if not already complete, e.g., `test` configuration)

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
-   Implement unit tests for functions within `src/lib/firestore.ts`, such as `getCollection`, `getDocument`, `addDocument`, `updateDocument`, `deleteDocument`, etc.
-   Mock the Firebase SDK (Firestore specifically) using `vitest` and `vi.mock` to ensure tests run in isolation without requiring a live Firebase connection.
-   Ensure tests cover common success and failure scenarios for the Firestore operations.
-   The new test file `src/__tests__/firestore.test.ts` must be created.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Vitest Setup**: Confirm that Vitest is correctly configured for the project. If `vite.config.ts` lacks a `test` property in its configuration, add a basic one, e.g., `test: { environment: 'jsdom' }`.
2.  **Firebase SDK Mocking**: Use `vi.mock('firebase/firestore', ...)` to mock the necessary Firebase Firestore functions (e.g., `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`). This will allow you to control their return values and test your helper functions in isolation.
3.  **Test File Creation**: Create a new test file at `src/__tests__/firestore.test.ts`.
4.  **Write Unit Tests**: For each significant helper function in `src/lib/firestore.ts`:
    *   Write `describe` blocks and `it` tests.
    *   Test successful scenarios where Firestore operations complete as expected.
    *   Test error scenarios where Firestore operations might fail (e.g., permission denied, network issues) and ensure your helper functions handle them gracefully.
    *   Use `expect` assertions to verify the behavior and return values of your helper functions.
5.  **Build and Lint**: Before completing the task, run `npm run build` and `npm run lint` to ensure no new errors are introduced.
6.  **Run Tests**: Execute `npm test` and ensure all new tests pass.

**Acceptance Criteria:**
*   A new file `src/__tests__/firestore.test.ts` exists.
*   This file contains `describe` blocks and `it` tests covering at least the `getCollection`, `getDocument`, `addDocument`, `updateDocument`, and `deleteDocument` functions from `src/lib/firestore.ts`.
*   The tests effectively mock the `firebase/firestore` module to run in isolation.
*   All tests pass when running `npm test`.
*   `npm run build` and `npm run lint` execute without errors.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
