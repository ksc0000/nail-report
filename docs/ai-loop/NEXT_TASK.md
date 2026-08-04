# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding Vitest and unit tests for core Firebase helper functions.

## Objective

Add Vitest setup (if necessary) and initial unit tests for key Firestore helper functions in `src/lib/firestore.ts`, specifically focusing on `addItem` and `getNailItems` related to `nailItems`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, no logic changes)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `package.json` (to add/update Vitest scripts or dev dependencies if not present)
-   `vitest.config.ts` (new file or modification for Vitest configuration)
-   `tsconfig.json` (if needed for Vitest integration)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files not explicitly mentioned in "Allowed Scope"

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add unit tests for `src/lib/firestore.ts` helper functions, specifically `addItem` and `getNailItems` (or similar core functions for creating and retrieving nail items).
-   Use `vi.mock` to mock the Firebase Firestore SDK dependencies (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `orderBy`).
-   Ensure Vitest is properly configured to run the new tests.

## Worker prompt

Your task is to implement the initial test coverage for the `src/lib/firestore.ts` file.

1.  **Vitest Setup:**
    *   Verify if Vitest is already installed and configured (`package.json`, `vitest.config.ts`, `tsconfig.json`).
    *   If not fully set up, add necessary `devDependencies` for Vitest and `@vitest/coverage-v8` to `package.json`, create a basic `vitest.config.ts`, and update `tsconfig.json` for test types if required.
    *   Add `test` script to `package.json` if missing (e.g., `"test": "vitest"`).

2.  **Create Test File:**
    *   Create a new file: `src/__tests__/lib/firestore.test.ts`.

3.  **Mock Firebase Firestore SDK:**
    *   In `src/__tests__/lib/firestore.test.ts`, use `vi.mock` to mock the `firebase/firestore` module. This is crucial to prevent actual interaction with Firebase during tests.
    *   Mock functions like `getFirestore`, `collection`, `addDoc`, `getDocs`, `query`, `orderBy` to return predictable data or throw controlled errors.

4.  **Write Unit Tests for `src/lib/firestore.ts`:**
    *   **Focus on `addItem`:** Write tests for the `addItem` function (or the equivalent function responsible for adding new nail items to Firestore).
        *   Test a successful item addition.
        *   Test error handling (e.g., if `addDoc` fails).
    *   **Focus on `getNailItems`:** Write tests for the `getNailItems` function (or the equivalent function responsible for fetching all nail items).
        *   Test successful retrieval of multiple items.
        *   Test retrieval when no items exist.
        *   Test error handling (e.g., if `getDocs` fails).
    *   Ensure all necessary imports are handled correctly.

5.  **Run Tests and Linters:**
    *   Run `npm test` to ensure your new tests pass.
    *   Run `npm run build && npm run lint` and address any issues.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
