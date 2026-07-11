# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task directly addresses Phase 2.1 by adding foundational unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, minor refactors)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only if adding `vitest` script or minimal config is required, no new dependencies)
- `vite.config.ts` (only if adding Vitest setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Ensure Vitest Setup:** Verify that Vitest is correctly configured in the project. If `npm run test` doesn't work or the configuration is missing, add the necessary Vitest setup to `vite.config.ts` and a `test` script to `package.json`.
2.  **Create Test File:** Create a new test file, `src/__tests__/firestore.test.ts`, for the unit tests related to Firestore.
3.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`) that are used within `src/lib/firestore.ts`. Mock their return values to simulate successful data operations and potential error conditions.
4.  **Test Helper Functions:** Write unit tests for the key functions exported by `src/lib/firestore.ts`. Focus on verifying the following for each tested function:
    *   It correctly calls the mocked Firebase SDK functions with the expected arguments (e.g., collection paths, document IDs, data payloads).
    *   It handles successful responses from the mocked SDK and returns the expected data structure.
    *   If applicable, it handles error scenarios (e.g., Firebase errors) gracefully.
    *   **Prioritize testing:** `addNailItem`, `getNailItems`, `getNailItemById`, `updateNailItem`, `deleteNailItem`, `getPublicShareLink`, `addPublicShareLink`, `deletePublicShareLink`, `updatePublicShareLink`.
5.  **Keep Tests Focused:** Each test should cover a small, specific piece of functionality.
6.  **Run Tests:** Ensure all new tests pass by running `npm run test`.
7.  **Lint and Build:** Verify `npm run lint` and `npm run build` pass successfully.
