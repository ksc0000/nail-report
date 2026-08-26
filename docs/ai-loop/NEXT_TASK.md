# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The first sub-phase, 2.1, explicitly targets adding unit tests for Firebase helper functions. This task focuses on `src/lib/firestore.ts` as the initial step in building out test coverage.

## Objective

Add initial Vitest unit tests for the core CRUD helper functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/` (except `src/main.tsx`)
-   `src/lib/firestore.ts`
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `src/App.css` (CSS improvements)

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
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to implement unit tests for the `src/lib/firestore.ts` helper functions using Vitest.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts` if it doesn't already exist.
2.  **Focus on core CRUD operations**: Write tests for the following functions within `src/lib/firestore.ts`:
    *   `addItem`
    *   `updateItem`
    *   `deleteItem`
    *   `getItems`
3.  **Mock Firebase SDK**: Use `vitest`'s mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore` functions like `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`). This ensures that tests run in isolation without actual interaction with Firebase.
4.  **Assert outcomes**: Ensure tests assert the correct behavior and error handling (if applicable) of these helper functions.
5.  **Do not add new npm dependencies**: Vitest should be configured already as per the roadmap. Do not add `vitest` or any other new package to `package.json`.
6.  **Keep it minimal**: Focus on a few clear test cases for each function to stay within the line limit.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
