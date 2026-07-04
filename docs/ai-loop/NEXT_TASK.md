# Worker Prompt Template

## Context

The AI Loop is initiating Phase 2, focusing on improving stability, test coverage, and UX. This first substantive task will lay the groundwork for better code quality by adding unit tests to critical helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (read only, no modifications to existing functionality)
-   `src/__tests__/` (create new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
-   `package.json` (read only, no dependency modifications)
-   `vite.config.ts` (read only, Vitest should already be configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` (no new npm packages or dependency modifications)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except where explicitly allowed.

## Requirements

-   Create a new test file, e.g., `src/__tests__/lib/firestore.test.ts`.
-   Write unit tests for key helper functions exported from `src/lib/firestore.ts`. Focus on testing their behavior with mock Firebase SDK interactions.
-   Mock Firebase SDK functions (e.g., `getDoc`, `setDoc`, `collection`, `query`, `where`, `getDocs`, `deleteDoc`) as needed using `vi.mock`.
-   Aim for good coverage of the `firestore.ts` helpers.
-   Keep the total diff to approximately 100-150 lines (new test file + mocks + test cases).
-   Run `npm run test` to ensure tests pass.
-   Run `npm run build && npm run lint` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
