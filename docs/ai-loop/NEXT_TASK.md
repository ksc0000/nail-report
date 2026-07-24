# Worker Prompt Template

## Context

The application needs improved test coverage for its core Firebase interactions. The `src/lib/firestore.ts` file contains critical helper functions for managing `nailItems` and other Firestore operations. Adding unit tests for these functions will enhance the stability and maintainability of the application.

## Objective

Implement unit tests using Vitest for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, but prioritize adding tests)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `package.json` (only to add a test script if `vitest` is not already configured, but do NOT add new npm dependencies)
-   `vite.config.ts` (if Vitest configuration is not already set up)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for build/test config files specified above.

## Requirements

-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Use Vitest for writing the unit tests.
-   Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) as needed to isolate the `firestore.ts` logic.
-   Cover at least 2-3 key helper functions in `src/lib/firestore.ts` with unit tests (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
-   Ensure tests verify the correct Firestore methods are called with the expected arguments.
-   Keep diff ≤ 150 lines.
-   Run `npm test` (or `npm run test` if configured) to ensure new tests pass.
-   Run `npm run build && npm run lint` before finishing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
