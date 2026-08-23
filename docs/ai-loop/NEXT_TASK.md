# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that basic AI Loop setup tasks are complete or in progress, and no substantive feature tasks have been picked yet. The immediate goal is to address test coverage as outlined in Phase 2.1.

## Objective

Implement Vitest unit tests for a few key helper functions within `src/lib/firestore.ts`. The focus should be on demonstrating proper mocking of the Firebase Firestore SDK to enable isolated unit testing.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactoring for testability if essential, but prioritize testing existing functions)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (minor additions for Vitest setup if strictly necessary, but Vitest should largely be configured already)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/`, `src/__tests__/`, `vite.config.ts`

## Requirements

-   Keep the overall diff for the pull request at or below 150 lines.
-   Create a new test file named `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least 2-3 key helper functions in `src/lib/firestore.ts` that interact with the Firestore SDK (e.g., functions responsible for adding, retrieving, updating, or deleting `nailItems` or `publicShares`).
-   Demonstrate effective mocking of Firebase Firestore SDK methods (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` as recommended by Vitest documentation.
-   Ensure tests are isolated and do not make actual calls to Firebase.
-   All tests must pass.
-   Run `npm run build && npm run lint` before finishing and ensure no errors or warnings are reported.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
