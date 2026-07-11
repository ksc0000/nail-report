```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK calls to test the logic of these functions in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize minimal changes)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (if Vitest configuration requires adjustment for mocking, keep changes minimal)

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
- Create `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (`doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`) using `vitest` and `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Write at least one passing unit test for `addNailItem` and `getNailItems` functions.
- Ensure the tests cover basic successful execution paths for the selected functions.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock('firebase/firestore', ...)` to mock the necessary Firestore functions (`doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`). Ensure the mocks return predictable values or resolve promises as expected for successful scenarios.
3.  **Test `addNailItem`:**
    *   Write a test case that verifies `addNailItem` correctly calls the mocked `setDoc` with the expected `nailItem` data and `userId`.
    *   Ensure it handles the `id` field creation correctly (either passed in or generated).
4.  **Test `getNailItems`:**
    *   Write a test case that verifies `getNailItems` correctly queries the mocked Firestore collection for a given `userId`.
    *   Mock `getDocs` to return an array of mock `QueryDocumentSnapshot` objects, each containing a `data()` method and an `id` property, so `getNailItems` can transform them into `NailItem` objects.
    *   Verify the returned array matches the expected `NailItem` structure.
5.  **Run tests:** Execute `npm test` and ensure all new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to confirm no new errors are introduced.

**Follow-up consideration (do not implement now):** After this task, tests for `updateNailItem` and `deleteNailItem` should be added. Also, error handling scenarios should be tested.
```
