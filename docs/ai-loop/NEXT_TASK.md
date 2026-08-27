```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. This task directly addresses "2.1 Test coverage" by adding unit tests for core Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for a selection of helper functions within `src/lib/firestore.ts`, specifically focusing on mocking Firebase Firestore interactions to enable isolated testing.

## Allowed Scope

- `src/lib/firestore.ts` (to export functions if needed for testing, minor changes only)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if minor Vitest configuration is needed, e.g., for `vi.mock` setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any CSS files (App.css, etc.)

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

Your task is to implement initial unit tests for `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file:** `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK:** Implement `vi.mock('firebase/firestore', ...)` to prevent actual database calls during tests. The mock should provide mock implementations for functions like `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, etc. Focus on simulating successful operations for now.
3.  **Write unit tests for at least one core function in `src/lib/firestore.ts`:**
    *   Prioritize `addNailItem` and/or `getNailItems`.
    *   Ensure tests assert the expected behavior and verify that the mocked Firestore functions are called correctly with the right arguments.
    *   Focus on covering a happy path scenario for the selected function(s).
4.  **Ensure `src/lib/firestore.ts` functions are testable:** If any functions are not currently exported, ensure they are exported for testing purposes (this change should be minimal).

**Acceptance Criteria:**

*   A new test file `src/__tests__/lib/firestore.test.ts` exists.
*   The Firebase Firestore SDK is mocked using `vi.mock`.
*   At least one function (`addNailItem` or `getNailItems`) from `src/lib/firestore.ts` has a passing unit test.
*   The tests verify the correct interaction with the mocked Firestore functions.

**Required Test Commands:**

```bash
npm install # Ensure all dependencies are up to date
npm run test # Run the newly added Vitest tests
npm run build
npm run lint
```
```
