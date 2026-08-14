# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This involves setting up Vitest if not already configured and writing mocked tests for the Firestore interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, e.g., exports)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (for Vitest configuration, if needed)
- `package.json` (only for adding `vitest` script if not present, NO new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any UI components or other `src/lib/` files not directly related to `firestore.ts` testing.

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

1.  **Vitest Setup (if necessary):**
    *   Ensure Vitest is correctly configured in `vite.config.ts`. If a basic setup is missing, add it to enable `.test.ts` files. Do not add `vitest` as a new dependency if it's not already in `package.json`; assume it's available or part of an existing setup. If `package.json` is modified, it should only be to add a `test` script, e.g., `"test": "vitest"`.
2.  **Create Test File:**
    *   Create a new test file at `src/__tests__/lib/firestore.test.ts`.
3.  **Mock Firebase SDK:**
    *   Implement robust mocking for the Firebase SDK functions used within `src/lib/firestore.ts` (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc.). Use `vi.mock` from Vitest to prevent actual Firebase calls during tests. Focus on mocking the behavior, not the entire Firebase SDK.
4.  **Write Unit Tests:**
    *   Write unit tests for all exported helper functions in `src/lib/firestore.ts`.
    *   Cover basic CRUD operations (create, read, update, delete) and their success paths.
    *   If `firestore.ts` includes explicit error handling (e.g., `try-catch` blocks returning specific error types), add tests to verify these error paths.
    *   Ensure tests are isolated and do not depend on external state.

## Acceptance Criteria

-   A new file `src/__tests__/lib/firestore.test.ts` exists.
-   All exported functions in `src/lib/firestore.ts` have at least one passing unit test.
-   Firebase SDK functions are mocked, and tests do not interact with actual Firebase services.
-   `npm run test` (or `vitest`) runs successfully, and all new tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
