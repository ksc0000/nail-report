# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The goal is to begin adding unit tests for the application's core logic.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments needed for testability, though minimal changes are expected)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files as needed for `firestore.ts` helpers)
- `vite.config.ts` (if Vitest configuration for `src/lib/` is not yet complete or needs adjustment for testing `src/lib` files)

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

Your task is to add unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Add `src/__tests__/firestore.test.ts`.
2.  **Configure Vitest (if necessary):** Ensure Vitest is correctly set up to run tests in `src/__tests__/` and can mock modules. If `vite.config.ts` needs modification, keep it minimal.
3.  **Implement tests:**
    *   Focus on testing the core logic of at least 2-3 significant functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, or `getNailItemsCollection`.
    *   **Mock Firebase SDK:** Crucially, mock the `firebase/firestore` module and its related functions (e.g., `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `query`, `getDocs`) to isolate the `firestore.ts` logic from actual Firebase calls during tests. Use `vi.mock` from Vitest for this.
    *   Ensure tests cover both successful operations and edge cases or potential error scenarios where applicable (e.g., what happens if a `getDoc` returns null).
4.  **Adhere to constraints:** Keep the pull request small (diff ≤ 150 lines) and do not introduce new npm dependencies.

**Acceptance Criteria:**

- A new file `src/__tests__/firestore.test.ts` exists containing unit tests for `src/lib/firestore.ts`.
- The tests effectively mock the Firebase Firestore SDK using `vi.mock`.
- The tests cover at least 2-3 key helper functions from `src/lib/firestore.ts`.
- All new tests pass successfully when `npm test` is run.

**Required test commands:**

```bash
npm install
npm test
npm run build
npm run lint
```
