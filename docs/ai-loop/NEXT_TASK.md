# Worker Prompt Template

## Context

The product roadmap for `nail-report` is currently in Phase 2, focusing on improving stability, test coverage, and UX. A key item in Phase 2.1 is to add unit tests for Firebase helper functions. This task specifically targets the Firestore helper functions.

## Objective

Implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if needed for testability)
-   `src/__tests__/lib/firestore.test.ts` (new file)
-   `package.json` (only to add `vitest` script if missing, no new dependencies)
-   `vite.config.ts` (only to configure Vitest, if necessary)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, except `vitest` if not already present)
-   Firebase deploy commands
-   Secrets and credentials
-   Any file outside of the `src/` directory, except specified.

## Requirements

-   Create a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Write unit tests for at least two core functions within `src/lib/firestore.ts` (e.g., `addItem`, `updateItem`, `deleteItem`, `getItems`, `getPublicShare`). Focus on mocking Firebase SDK interactions rather than actual database calls.
-   Utilize `vi.mock` to mock Firebase SDK functionality (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `where`).
-   Ensure the tests run successfully using `npm run test`.
-   Keep the total diff for the PR to ≤ 150 lines.
-   Run `npm run build && npm run lint` successfully before marking the task complete.
-   Do not add any new npm dependencies. If `vitest` setup is missing, only add the necessary configuration/script to `package.json` for running tests, without introducing a new `devDependencies` entry.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
