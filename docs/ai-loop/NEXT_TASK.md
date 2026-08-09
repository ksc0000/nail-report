# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current objective is to begin implementing unit test coverage for core helper functions. This task specifically targets the Firestore helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. The focus should be on key CRUD operations and ensuring proper interaction with the mocked Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer to test public API directly)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest setup, if absolutely necessary, but generally prefer existing setup)

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
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock the Firebase SDK (specifically `firebase/firestore`) using `vi.mock` to isolate tests from actual Firebase calls.
- Write tests for at least two key functions in `src/lib/firestore.ts` (e.g., `createNailItem` and `getNailItems`, or `updateNailItem` and `deleteNailItem`).
- Ensure tests assert successful calls and potentially handle common error scenarios if simple mocking allows.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

Hello Jules,

Your next task is to begin implementing unit tests for the core Firestore helper functions in `src/lib/firestore.ts`.

Here's what you need to do:

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore:** Use `vi.mock('firebase/firestore', ...)` to mock the necessary Firestore functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). This will prevent tests from making actual network requests to Firebase.
3.  **Implement Tests:** Choose at least two significant public helper functions from `src/lib/firestore.ts` that interact with Firestore (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`). Write unit tests for these functions.
    *   Focus on asserting that the mocked Firestore functions are called with the correct arguments.
    *   Ensure the helper functions return the expected values based on your mocks.
4.  **Run Tests:** Execute `npm test` to verify your tests pass.
5.  **Lint and Build:** Run `npm run lint && npm run build` to ensure code quality and no build errors.

Remember to keep the PR focused on just these tests and within the line limit. Good luck!
