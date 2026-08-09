# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1, which aims to increase test coverage for core utility functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK dependencies to isolate the logic within `firestore.ts` for testing.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer to test existing exports)
-   `src/__tests__/` (create new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
-   `vite.config.ts` (minor additions for Vitest setup if strictly necessary, but prefer to leverage existing setup)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`

## Requirements

-   Keep diff ≤ 150 lines.
-   Add at least one test file (`src/__tests__/lib/firestore.test.ts` or similar).
-   Focus on testing core functions in `src/lib/firestore.ts` that interact with Firestore.
-   Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) as necessary using `vi.mock` to ensure tests are isolated and do not require a live Firebase connection.
-   Run `npm run build && npm run lint` before finishing.
-   Ensure tests pass (`npm test`).

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
