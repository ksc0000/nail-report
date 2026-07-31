```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. We are currently in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for our core Firebase helper functions.

## Objective

Implement unit tests for one or more helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/App.css` (no changes expected for this task)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, unlikely)

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

## Worker Prompt

Your task is to implement unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Using `vitest` and `vi.mock`, mock the Firebase Firestore SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`). Focus on mocking the necessary functions to isolate `firestore.ts` logic.
3.  **Write Unit Tests:** Implement at least one unit test for a simple CRUD operation helper function within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`).
    *   Ensure the test verifies that the correct Firestore methods are called with the expected arguments.
    *   The test should cover a successful scenario.
    *   Consider mocking an error/rejection case if simple to do and keeps the diff small.
4.  **Export Functions:** If any functions in `src/lib/firestore.ts` are not currently exported but are internal helpers, and need to be tested directly, you may modify `src/lib/firestore.ts` to export them. Otherwise, test the publicly exposed functions.

### Acceptance Criteria:

*   A new file `src/__tests__/firestore.test.ts` exists.
*   The test file uses `vitest` and `vi.mock` to mock Firestore SDK.
*   At least one unit test for a `src/lib/firestore.ts` helper function is implemented and passes.
*   The test verifies that mocked Firestore methods are called correctly.

### Required test commands:

```bash
npm test
npm run build
npm run lint
```

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
