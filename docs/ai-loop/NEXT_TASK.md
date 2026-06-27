```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in this phase is adding unit tests, starting with helper functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize minimal changes)
- `src/__tests__/` (new test files for `firestore.ts`)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, prefer avoiding)
- `package.json` (only to add a script if needed, *not* to add new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except for `vite.config.ts` if strictly necessary.

## Requirements

- Keep the diff ≤ 150 lines. Focus on testing a few core functions first (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure Firebase SDK calls are mocked appropriately using `vi.mock` to allow for isolated unit testing.
- Write clear, descriptive test cases covering basic functionality and potential edge cases for the tested functions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Implement unit tests for `src/lib/firestore.ts` helper functions using Vitest.

1.  Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
2.  Mock the Firebase Firestore SDK using `vi.mock('firebase/firestore')` and provide mock implementations for functions like `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, etc., as needed by the `firestore.ts` helpers.
3.  Write unit tests for the following functions in `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `getNailItems`
    *   `updateNailItem`
    *   `deleteNailItem`
4.  Each test should verify the correct interaction with the mocked Firestore SDK (e.g., `expect(addDoc).toHaveBeenCalledWith(...)`) and the expected return values.
5.  Ensure the tests are isolated and do not make actual calls to Firebase.
6.  Run `npm test` to verify the tests pass.
7.  Run `npm run build && npm run lint`.
```
