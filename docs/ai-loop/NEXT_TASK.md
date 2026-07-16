```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` includes improving test coverage, specifically adding unit tests for Firebase helper functions. This task focuses on the Firestore helper functions to enhance stability and ensure correct data operations.

## Objective

Implement Vitest unit tests for a subset of functions within `src/lib/firestore.ts`, specifically focusing on `addNailItem` and `getNailItems`. This will involve mocking the Firebase SDK to isolate the logic.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but prefer to only import)
- `src/__tests__/firestore.test.ts` (new test file)
- `vitest.config.ts` (if minimal configuration for mocks is required, e.g., setupFiles)

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

Your task is to add Vitest unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Within `src/__tests__/firestore.test.ts`, use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`). You will need to mock `doc`, `collection`, `addDoc`, `getDocs`, `query`, `where`, and any other Firestore methods directly used by `addNailItem` and `getNailItems`. Ensure the mocks simulate successful operations and return expected data structures.
3.  **Implement tests for `addNailItem`:**
    *   Test that `addNailItem` successfully calls `addDoc` with the correct Firestore collection and data.
    *   Verify that it returns the expected structure upon successful addition.
4.  **Implement tests for `getNailItems`:**
    *   Test that `getNailItems` successfully calls `getDocs` on the correct Firestore collection.
    *   Test that it correctly processes and returns a list of nail items from mocked Firestore data.
    *   Consider testing with and without a `userId` if the function supports it.
5.  **Run tests:** Ensure the newly added tests pass by running `npm test` (or `vitest`).
6.  **Run linters and build:** Execute `npm run build && npm run lint` and address any reported issues.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists with at least one passing test for `addNailItem` and one for `getNailItems`.
*   The Firebase Firestore SDK is appropriately mocked in the test file.
*   No new npm dependencies are added.
*   The diff is within the 150-line limit.

**Required Test Commands:**

```bash
npm test
npm run build
npm run lint
```
```
