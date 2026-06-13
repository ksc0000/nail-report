# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current sub-phase is 2.1, which emphasizes adding unit tests. Vitest is the chosen test runner, and Firebase SDK mocking is required.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest, ensuring that Firebase Firestore SDK interactions are properly mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions or small refactors to enable testing, if necessary)
-   `src/__tests__/firestore.test.ts` (new test file)
-   Existing Vitest configuration files (e.g., `vite.config.ts` if adding test setup)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css` or other UI-related CSS files (not relevant to this task)

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add tests for helper functions within `src/lib/firestore.ts` related to `nailItems` or `publicShares` CRUD operations.
-   Firebase Firestore SDK methods must be mocked using `vi.mock` to ensure tests are isolated and fast.
-   At least 3 functions in `src/lib/firestore.ts` should have unit test coverage.
-   Create a new test file: `src/__tests__/firestore.test.ts`.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to add unit tests for the utility functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore**: Within `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the Firebase Firestore SDK. Focus on mocking methods typically used for CRUD operations (e.g., `collection`, `doc`, `addDoc`, `getDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
3.  **Implement Unit Tests**: Write unit tests for at least 3 functions in `src/lib/firestore.ts`. Prioritize functions involved in adding, getting, updating, or deleting `nailItems`. Ensure that your tests verify the correct interaction with the mocked Firestore methods and handle expected return values.
4.  **Run Tests**: Execute `npm test` (or `vitest`) to confirm tests pass.
5.  **Lint and Build**: Run `npm run build && npm run lint` to ensure code quality and prevent regressions.

**Example functions to consider for testing in `src/lib/firestore.ts`:**
*   `addNailItem`
*   `getNailItems`
*   `updateNailItem`
*   `deleteNailItem`
*   `getPublicShare`
*   `createPublicShare`

Focus on testing the logic within these functions, assuming the mocked Firebase interactions behave as expected.

Suggested next task for the `NEXT_TASK.md` output: Add unit tests for `src/lib/storage.ts` helpers.
