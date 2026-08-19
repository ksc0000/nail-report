# Worker Prompt Template

## Context

The current phase is "Phase 2 — Active" focusing on stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest, ensuring comprehensive coverage and correct mocking of the Firebase SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes allowed if necessary for testability, e.g., exporting unexported functions, but prioritize testing existing public API).
-   `src/__tests__/lib/firestore.test.ts` (new file for tests).
-   `package.json` (only if adding a new `test` script command, no new dependencies).
-   `vite.config.ts` (if Vitest configuration is needed).

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` and project configuration (e.g., `vite.config.ts`).

## Requirements

-   Keep diff ≤ 150 lines.
-   Write unit tests for the primary CRUD and share-related functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `createPublicShare`, `deletePublicShare`, etc.).
-   Mock the Firebase Firestore SDK using `vitest`'s mocking features to isolate `firestore.ts` functions from actual Firebase calls.
-   Ensure tests cover successful operations and error handling paths where applicable.
-   Run `npm run build && npm run lint && npm test` before finishing, and ensure all commands pass.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---
## Worker Prompt

### Summary
The task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`. This involves creating a new test file, mocking the Firestore SDK, and writing tests for functions like `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `createPublicShare`, and `deletePublicShare`.

### Changed files list
-   `src/__tests__/lib/firestore.test.ts` (new file)
-   Potentially minor modifications to `src/lib/firestore.ts` if helpers need to be exported for testing.
-   Potentially `package.json` to ensure `npm test` runs Vitest.

### Commands run and results
```bash
npm run build
npm run lint
npm test
```
Expected: All commands should pass without errors. `npm test` should show the new tests passing.

### Known issues or limitations
-   The current `firestore.ts` might require minor refactoring (e.g., explicit exports) to make all helper functions easily testable. This should be kept minimal and within the line limit.
-   Mocking the Firebase SDK can be complex; ensure mocks accurately reflect expected Firestore behavior for the tests.

### Suggested next task
Add Vitest + unit tests for `src/lib/storage.ts` helpers to continue improving test coverage.
