```markdown
# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort for core Firebase helper functions.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing, but prefer minimal changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (minor changes for test setup if absolutely required for mocking, but prefer `vi.mock` in test files)

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

---

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions using Vitest.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`). Focus on mocking the functions called directly by `src/lib/firestore.ts`.
3.  **Implement tests for `addNailItem`:**
    *   Verify that `addNailItem` correctly calls the mocked `addDoc` function with the expected data and collection path.
    *   Test both success and potential error paths (if `addDoc` mock can throw an error).
4.  **Implement tests for `getNailItems`:**
    *   Verify that `getNailItems` correctly calls the mocked `getDocs` function.
    *   Verify that it processes the snapshot data correctly and returns the expected array of items.
    *   Consider testing with an empty snapshot and a snapshot with multiple items.
5.  **Run tests:** Ensure all new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure no new errors are introduced.

**Acceptance Criteria:**

*   A new file `src/__tests__/firestore.test.ts` exists.
*   `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts` have basic unit test coverage, mocking their Firebase dependencies.
*   `npm test` (or `vitest`) runs successfully, with new tests passing.

**Required Test Commands:**

```bash
npm test
npm run lint
npm run build
```
```
