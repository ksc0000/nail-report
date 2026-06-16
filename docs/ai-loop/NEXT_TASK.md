# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. This task contributes to improving test coverage by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for one or more helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file)
- `vite.config.ts` (minor additions for Vitest configuration, if necessary)

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

## Worker prompt

Your task is to add unit tests for Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest:** Ensure Vitest is configured to run these tests. If `vite.config.ts` needs minor adjustments for Vitest setup (e.g., test environment), you may include them.
3.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase SDK dependencies (e.g., `firebase/firestore`) to isolate the `firestore.ts` functions during testing. You will need to mock `getFirestore`, `collection`, `addDoc`, `updateDoc`, `deleteDoc`, etc.
4.  **Implement tests:** Focus on implementing tests for at least one core CRUD helper function from `src/lib/firestore.ts`. Good candidates are `addItem`, `updateItem`, or `deleteItem`.
    *   Verify that the Firestore SDK methods are called with the correct arguments.
    *   Handle successful and potential error scenarios for the chosen function(s).
5.  **Keep it focused:** The goal is to establish a testing pattern for these helpers. Do not attempt to test all functions in `firestore.ts` in this single task to maintain a small diff.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- The new test file contains unit tests for at least one function from `src/lib/firestore.ts`.
- Firebase SDK calls are mocked appropriately using `vi.mock`.
- All tests pass when running `npm run test`.

**Required Test Commands:**
```bash
npm install # Ensure all dependencies are up-to-date
npm run build
npm run lint
npm run test
```
