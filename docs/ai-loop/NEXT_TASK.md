```markdown
# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is adding unit tests for Firebase helper functions. This task addresses that by focusing on `firestore.ts`.

## Objective

Add unit tests for helper functions defined in `src/lib/firestore.ts` using Vitest, specifically targeting functions that interact with the Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only to ensure Vitest is configured correctly, if necessary)
- `package.json` (only to confirm Vitest as a dev dependency, no new packages)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on testing a representative subset of functions to meet the line limit.
- Run `npm run build && npm run lint` before finishing.
- Ensure tests mock the Firebase Firestore SDK correctly to avoid actual database calls.
- Write tests for at least `createNailItem` and `getNailItems` in `src/lib/firestore.ts`. If the line limit allows, add tests for `updateNailItem` or `deleteNailItem`.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Inside `firestore.test.ts`, use `vi.mock` to mock the Firebase Firestore SDK. Specifically, mock the `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc` functions/methods to simulate their behavior without making actual network requests. Refer to Vitest documentation for mocking modules.
3.  **Test `createNailItem`:** Write a unit test that verifies `createNailItem` correctly calls `addDoc` with the provided data and returns the expected ID.
4.  **Test `getNailItems`:** Write a unit test that verifies `getNailItems` correctly calls `collection` and `getDocs` and transforms the mock snapshot data into the expected array of `NailItem` objects.
5.  **Run tests:** Execute `npm test` to ensure your new tests pass.
6.  **Lint and Build:** Run `npm run lint` and `npm run build` to ensure no new errors are introduced.
7.  **Keep it concise:** Prioritize `createNailItem` and `getNailItems` tests to stay within the ~150 line diff limit. If there's room, add one more function test (e.g., `updateNailItem`).
```
