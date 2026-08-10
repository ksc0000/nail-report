# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. A key next step is to introduce unit tests for core utility functions.

## Objective

Implement unit tests for *two to three* helper functions within `src/lib/firestore.ts` using Vitest. The goal is to establish a testing pattern for Firebase-related helpers, specifically focusing on functions that interact with Firestore collections and documents.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting non-exported functions, but prefer not to modify)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `vite.config.ts` (only if necessary for Vitest configuration, but Vitest is assumed to be set up)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`

## Requirements

-   Identify two to three simple helper functions in `src/lib/firestore.ts` that interact with Firestore (e.g., functions for fetching data, adding a document, or updating a document).
-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Use Vitest for testing.
-   Mock the Firebase SDK (e.g., `firebase/firestore`) using `vi.mock` to isolate the `firestore.ts` functions and prevent actual database calls.
-   Ensure tests cover successful execution paths and basic error handling where applicable for the chosen functions.
-   Keep the overall diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
