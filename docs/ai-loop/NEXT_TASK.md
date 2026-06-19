```markdown
# Worker Prompt Template

## Context

The current roadmap for nail-report emphasizes improving stability and test coverage. Phase 2.1 specifically targets adding unit tests for core helper functions. This task focuses on implementing these tests for the Firestore utility functions, which are critical for the application's data management.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability, such as exporting functions if strictly necessary, but prefer mocking external dependencies).
-   `src/__tests__/firestore.test.ts` (new file for tests).
-   `vite.config.ts` (if Vitest configuration needs adjustment, but assume basic setup is ready).
-   `package.json` (only to verify existing `vitest` scripts, no new npm dependencies allowed).

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify).
-   `commands/` (PowerShell scripts — do not modify).
-   `firestore.rules`, `storage.rules` (require human approval).
-   `package.json` deps (no new npm packages without human approval).
-   Firebase deploy commands.
-   Secrets and credentials.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker prompt

Jules,

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`. This will improve the reliability and maintainability of our data interaction logic.

Here are the specific steps:

1.  **Create a new test file:** Create a new file named `src/__tests__/firestore.test.ts`.
2.  **Implement unit tests:**
    *   Choose at least two primary functions from `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`) to test.
    *   Utilize `vitest` for the testing framework and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`). This ensures that tests are isolated from actual Firebase backend calls.
    *   Focus on verifying that the functions correctly call the mocked Firebase SDK methods with the expected arguments and handle typical success and error scenarios.
3.  **Ensure test pass:** Run the tests to confirm that all new unit tests pass successfully.
4.  **Lint and Build:** Verify that the project still builds successfully and passes all lint checks.

**Acceptance Criteria:**

-   A new file `src/__tests__/firestore.test.ts` is created.
-   This file contains well-structured unit tests for at least two functions from `src/lib/firestore.ts`.
-   Firebase SDK dependencies are properly mocked using `vi.mock` to ensure isolated testing.
-   All new tests pass when running `npm test`.
-   The code adheres to project ESLint rules and the application builds without errors.

**Required Test Commands:**

```bash
npm test
npm run build
npm run lint
```
```
