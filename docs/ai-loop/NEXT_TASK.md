# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on basic CRUD operations and data marshalling logic.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (to configure Vitest if not already done, but avoid adding new deps)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Test at least `addNailItem`, `updateNailItem`, and `deleteNailItem` functions.
- Verify that data is correctly transformed when interacting with Firestore.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Worker prompt

Your task is to add unit tests for `src/lib/firestore.ts`.

1.  **Set up Vitest (if not already done):** Ensure `vite.config.ts` is configured to run Vitest tests. If Vitest is not fully integrated or configured for mocking, set it up. Check `package.json` for `vitest` dependency. If it's missing, add it to `devDependencies` if allowed (refer to `package.json` deps constraint, but `vitest` should already be there for the current phase).
2.  **Create a test file:** Create `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK:** Use `vi.mock` to mock `firebase/firestore` and any other Firebase dependencies to isolate the `firestore.ts` functions. You'll need to mock `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, etc. Return mock objects that allow testing the logic within `firestore.ts`.
4.  **Write tests for `addNailItem`:**
    *   Verify that `setDoc` (or `addDoc` if used) is called with the correct collection path and data after transformation.
    *   Ensure the function returns the expected result (e.g., the added item with an ID).
5.  **Write tests for `updateNailItem`:**
    *   Verify that `updateDoc` is called with the correct document reference and updated data.
    *   Ensure the function handles partial updates correctly.
6.  **Write tests for `deleteNailItem`:**
    *   Verify that `deleteDoc` is called with the correct document reference.
    *   Ensure the function handles successful deletion.
7.  **Run tests:** Execute `npm run test` and ensure all new tests pass.
8.  **Lint and Build:** Run `npm run lint` and `npm run build`. Address any issues.
