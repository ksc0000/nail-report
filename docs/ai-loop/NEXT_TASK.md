# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. This task focuses on establishing unit tests for critical Firebase helper functions. Vitest is the chosen test runner for this project, and it's expected to be a development dependency already.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. This involves creating a new test file and mocking Firebase SDK interactions where necessary.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to production code)
- `src/lib/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (minimal configuration for Vitest if not already present)
- `package.json` (no new npm dependencies should be added, `vitest` should already be present)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/lib/__tests__/firestore.test.ts` for the tests.
- Use `vitest` and appropriate mocking techniques for Firebase SDK calls (e.g., `vi.mock`).
- Cover at least the primary CRUD-related functions in `src/lib/firestore.ts` with unit tests.
- Ensure tests are independent and do not rely on actual Firebase backend calls.
- Run `npm run build && npm run lint && npm test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

The `src/lib/firestore.ts` file contains functions for interacting with Firestore, such as `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`. Your task is to set up a unit test file for these functions.

1.  **Ensure Vitest setup:** Verify `vitest` is a dev dependency in `package.json`. If `vite.config.ts` does not contain Vitest configuration (e.g., `test` property), add the minimal setup required.
2.  **Create Test File:** Create a new file `src/lib/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK:** Inside `firestore.test.ts`, mock the Firebase Firestore SDK functions that `src/lib/firestore.ts` uses (e.g., `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `doc`, `collection`, `query`, `where`, etc., from `firebase/firestore`). Use `vi.mock` for this purpose.
4.  **Write Unit Tests:** Write tests for at least `addNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem`.
    *   For `addNailItem`, test that `addDoc` is called with the correct collection and data.
    *   For `getNailItems`, test that `getDocs` is called and returns formatted data.
    *   For `updateNailItem`, test that `updateDoc` is called with the correct document reference and data.
    *   For `deleteNailItem`, test that `deleteDoc` is called with the correct document reference.
5.  **Run Tests:** Execute `npm test` and ensure all new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure no new issues are introduced.
