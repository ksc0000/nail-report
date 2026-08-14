# Worker Prompt Template

## Context

The application is in Phase 2.1 of the roadmap, focusing on improving test coverage. The goal is to start adding unit tests for core helper functions.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, including basic mocking of Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if necessary, but focus on testing existing logic)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/setupTests.ts` (if global Vitest setup for Firebase mocks is needed)

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

1.  **Create Test File:** Create a new test file at `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK:** Set up basic Vitest mocks for the Firebase Firestore SDK functions that `src/lib/firestore.ts` interacts with (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). This will ensure tests are isolated and don't require a live Firebase connection. You might need to add this setup to `src/setupTests.ts` or directly within the test file if it's specific to firestore.
3.  **Add Unit Tests:** Implement unit tests for at least 2-3 key helper functions within `src/lib/firestore.ts`. Prioritize functions like `addItem`, `getItem`, `updateItem`, `deleteItem`, or `getItems`.
4.  **Ensure Isolation:** Tests should be isolated, testing only the logic within the `firestore.ts` functions and relying on the mocked Firebase SDK.
5.  **Run Tests:** Ensure all new tests pass. You can use `npm test` or `vitest`.
6.  **Code Quality:** Ensure the new test code follows existing coding styles.

**Acceptance Criteria:**
- A new file `src/__tests__/lib/firestore.test.ts` exists.
- This file contains unit tests for at least 2 functions from `src/lib/firestore.ts`.
- Firebase Firestore SDK interactions are mocked to prevent actual database calls.
- All new tests pass successfully.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
