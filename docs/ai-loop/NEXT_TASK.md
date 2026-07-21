# Worker Prompt Template

## Context

The `nail-report` application is moving into Phase 2, focusing on improving stability, test coverage, and UX. The first sub-phase is dedicated to increasing test coverage. The `src/lib/firestore.ts` file contains critical helper functions for interacting with Firebase Firestore. Ensuring these functions are robust and correctly implemented is vital for the application's stability.

Vitest is the chosen test runner for this project.

## Objective

Add unit tests for the `createNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts` using Vitest, including mocking the Firebase Firestore SDK calls.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactoring)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `src/vite-env.d.ts` (if Vitest globals need to be added for TypeScript)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` (do not add new npm packages; assume Vitest is already installed as a dev dependency)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Write unit tests for `createNailItem` and `getNailItems` functions.
-   Mock the necessary Firebase Firestore SDK functions (e.g., `addDoc`, `getDocs`, `collection`, `query`) using `vi.mock` to isolate the functions under test.
-   Ensure tests cover successful execution and potential error cases (if applicable to the current function structure).
-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing and ensure all pass.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
