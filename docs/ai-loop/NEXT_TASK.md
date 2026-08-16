# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The first major item in Phase 2 is "2.1 Test coverage" using Vitest and mocking Firebase SDK. This task aims to kickstart the test coverage by targeting core Firestore helper functions.

## Objective

Implement unit tests for several core helper functions within `src/lib/firestore.ts` using Vitest, ensuring that Firebase SDK interactions are properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, e.g., exports)
- `src/__tests__/firestore.test.ts` (new test file)
- `vitest.config.ts` (if needed for basic setup, though Vitest should already be configured)

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

1.  **Identify target functions:** Focus on the following core CRUD helper functions in `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `getNailItems` (a basic success case without complex queries)
2.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK:** Use `vi.mock` from Vitest to mock the `firebase/firestore` module. Your mocks should simulate successful responses for the Firestore functions (`addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `collection`, `doc`, `where`, etc.) that the target helper functions interact with. Ensure tests do not make actual calls to Firebase.
4.  **Write unit tests:** For each identified function, write at least one successful unit test case.
    *   Verify that the mocked Firebase functions are called with the correct arguments.
    *   Verify that the helper function returns the expected result (e.g., a resolved promise, the correct data, or `void` for deletions).
5.  **Refactor (if necessary):** If any `src/lib/firestore.ts` functions are not easily testable (e.g., not exported, tightly coupled), make minimal, safe changes to improve testability.
6.  **Run tests:** Execute the newly created tests to ensure they pass.

**Acceptance Criteria:**

*   A new test file `src/__tests__/firestore.test.ts` exists.
*   The functions `addNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems` in `src/lib/firestore.ts` have at least one passing unit test each.
*   All Firebase SDK calls within these tests are mocked using Vitest, and no actual network requests to Firebase occur.
*   The tests verify correct input to the mocked Firebase functions and correct output from the helper functions.

**Required Test Commands:**

```bash
npm test
npm run build
npm run lint
```
