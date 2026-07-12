# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically targets enhancing test coverage for core utility functions that interact with Firestore. The current state indicates that `src/lib/firestore.ts` helper functions currently lack unit tests.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on basic CRUD operations and their respective success and failure paths.

## Allowed Scope

-   `src/lib/firestore.ts` (for potential minor adjustments to aid testability, but primarily to understand its API)
-   `src/__tests__/` (for creating new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
-   `src/App.css` (only if strictly necessary for testing a component, which is unlikely for this task)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files (this task *is* about adding tests).
-   Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to create a new unit test file for `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file:** In `src/__tests__/lib/`, create a new file named `firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the necessary Firebase Firestore SDK modules (e.g., `firebase/firestore`, `firebase/app`) to control their behavior during tests. You will need to simulate responses for successful operations and throw errors for failure scenarios.
3.  **Identify helper functions:** Analyze `src/lib/firestore.ts` to identify the core helper functions responsible for interacting with the `nailItems` collection (e.g., functions for adding, getting, updating, and deleting nail items).
4.  **Write unit tests:**
    *   For each identified helper function, write tests to verify its behavior for:
        *   **Successful execution:** Verify that the function correctly calls the mocked Firebase methods and returns the expected data or resolves successfully.
        *   **Error handling:** Verify that the function correctly catches errors thrown by the mocked Firebase methods and handles them as expected (e.g., throwing a specific error, returning null/undefined, or rejecting a promise).
5.  **Focus on coverage:** Aim to cover the main execution paths for at least 2-3 key Firestore helper functions. Do not attempt to cover every single edge case if it exceeds the line diff limit.
6.  **No new npm dependencies:** Ensure no new packages are added to `package.json`. Vitest is already configured.
7.  **Run tests:** Execute `npm test` to confirm all new tests pass.

**Example `src/lib/firestore.ts` functions you might find and need to test:**

*   `getNailItems(userId: string)`
*   `addNailItem(userId: string, itemData: NailItem)`
*   `updateNailItem(userId: string, itemId: string, updateData: Partial<NailItem>)`
*   `deleteNailItem(userId: string, itemId: string)`

---

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
