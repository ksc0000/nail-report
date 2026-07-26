# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for Firebase helper functions using Vitest. This task focuses on establishing the initial test coverage for the `firestore.ts` utility file.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest and mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to facilitate testing, e.g., exporting non-exported functions if necessary, but prefer not to modify business logic)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (if minor configuration is strictly required for mocking, but avoid if possible)
- `package.json` (only to add `test` script or similar if not already present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly mentioned in 'Allowed Scope'.

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/lib/firestore.test.ts` for the new tests.
- Use `vi.mock` to mock `firebase/firestore` functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `onSnapshot`) as needed.
- Focus on writing tests for `addNailItem` and `getNailItems` initially. Ensure these tests verify that the correct Firebase SDK functions are called with the expected arguments.
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

Your task is to add unit tests for the `src/lib/firestore.ts` file.

1.  **Create a new test file:** `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Firebase mocking:** Inside `firestore.test.ts`, use `vi.mock('firebase/firestore')` to mock the necessary Firestore functions. You'll likely need to mock `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, and `onSnapshot` to isolate the `firestore.ts` logic.
3.  **Write tests for `addNailItem`:**
    *   Verify that `addDoc` is called with the correct `collection` reference and `nailItem` data.
    *   Ensure the function handles success cases.
4.  **Write tests for `getNailItems`:**
    *   Verify that `getDocs` is called with the correct `collection` reference.
    *   Mock the return value of `getDocs` to simulate a list of `QueryDocumentSnapshot`s and ensure `getNailItems` correctly transforms and returns the data.
5.  **Run tests:** Execute `npm test` and ensure all new tests pass.
6.  **Lint and build:** Run `npm run lint` and `npm run build` to ensure no errors or warnings are introduced.

Keep the test coverage focused on these two functions (`addNailItem` and `getNailItems`) to keep the PR small. Report any challenges with mocking or test setup.
