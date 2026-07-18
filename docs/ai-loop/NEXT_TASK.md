# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key part of this phase is adding unit tests for core helper functions.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` functions within `src/lib/firestore.ts`, mocking the Firebase Firestore SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no functional changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files if necessary for shared mocks)
- `package.json` (only to add a Vitest script if not present, but no new dependencies)
- `vite.config.ts` (for Vitest configuration)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add Vitest unit tests for two specific helper functions in `src/lib/firestore.ts`: `addNailItem` and `getNailItems`.

1.  **Create a new test file**: `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK**: Use `vi.mock` to mock `firebase/firestore` functions like `doc`, `collection`, `addDoc`, `getDocs`, `query`, `orderBy`, `where`, `getFirestore`, etc., as needed for testing `addNailItem` and `getNailItems`. Ensure that mocked Firestore operations return predictable data or simulate success/failure.
3.  **Test `addNailItem`**:
    *   Verify that `addDoc` is called with the correct collection path and data when a new nail item is added.
    *   Verify the function returns the expected result (e.g., the ID of the new document).
4.  **Test `getNailItems`**:
    *   Verify that `getDocs` is called with the correct query (e.g., collection path, ordering, and potentially where clauses if `getNailItems` supports filtering).
    *   Verify that the function correctly transforms and returns the data retrieved from Firestore.
    *   Consider a test case for an empty collection.
5.  **Configure Vitest**: If not already present, ensure `vite.config.ts` includes Vitest setup. If `package.json` doesn't have a `test` script, add one (e.g., `"test": "vitest"`).
6.  **Adhere to the diff limit**: Focus strictly on `addNailItem` and `getNailItems`. If testing more functions would exceed the line limit, leave them for a follow-up task.

### Acceptance Criteria:

-   A new file `src/__tests__/firestore.test.ts` exists.
-   `addNailItem` is tested for successful document creation.
-   `getNailItems` is tested for successfully retrieving and formatting documents.
-   Firebase Firestore SDK is mocked correctly for these tests.
-   All new tests pass.

### Required Test Commands:

```bash
npm install # if package.json was modified with a new script or for vitest setup
npm run build
npm run lint
npm test # or `vitest` if `npm test` is not configured
```
