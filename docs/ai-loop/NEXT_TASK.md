```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)
- `vite.config.ts` (only for minimal Vitest configuration if absolutely required)

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

# Worker Prompt

## Task

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

### Detailed Instructions

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Import functions**: Import the relevant helper functions from `src/lib/firestore.ts` into the new test file.
3.  **Mock Firebase SDK**: Use `vi.mock` from Vitest to mock the Firebase Firestore SDK calls (e.g., `getFirestore`, `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, etc.) to control their behavior during tests. Assume Vitest is already configured as a test runner.
4.  **Write tests**: Write unit tests to cover the main functionalities of each helper function in `src/lib/firestore.ts`. Focus on:
    *   Verifying that mocked Firebase methods are called correctly with expected arguments.
    *   Testing successful data operations (create, read, update, delete).
    *   Handling error scenarios where Firebase operations might fail.
    *   Ensuring functions return the expected data structures.
5.  **Avoid actual Firebase calls**: All tests must use mocked Firebase services; do not make real network requests to Firebase.
6.  **Minor refactors (if necessary)**: If a function in `src/lib/firestore.ts` is difficult to test, you may apply minor refactors to improve testability, ensuring no change in external behavior. Keep such changes minimal and within the diff limit.

### Acceptance Criteria

-   A new file `src/__tests__/lib/firestore.test.ts` exists and contains unit tests.
-   The tests successfully mock Firebase Firestore SDK interactions.
-   The tests cover the primary helper functions in `src/lib/firestore.ts` (e.g., for creating, reading, updating, and deleting nail items or public shares).
-   All new tests pass when `npm test` (or `vitest`) is run.
-   The existing application functionality remains unchanged.

### Required Test Commands

```bash
npm run build
npm run lint
npm test
```
```
