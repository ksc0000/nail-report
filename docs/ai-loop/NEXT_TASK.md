# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for helper functions. The current state indicates that no substantive feature tasks have been completed, and Vitest is the chosen test runner.

## Objective

Implement unit tests for select helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK interactions and verifying core CRUD operations.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
-   `src/__tests__/firestore.test.ts` (new file)
-   `package.json` (only if adding a test script, *not* new dependencies)
-   `vite.config.ts` (if Vitest configuration is needed, but prefer to use existing setup)

## Forbidden Scope

-   `src/main.tsx`
-   `commands/`
-   `firestore.rules`, `storage.rules`
-   `package.json` dependencies (no new npm packages)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least two core functions from `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
-   Mock Firebase Firestore SDK interactions (e.g., `doc`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) using Vitest's mocking features.
-   Ensure tests cover both successful execution and basic error handling scenarios for the chosen functions.
-   Keep the overall diff for this PR strictly under 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   All new and existing tests must pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
