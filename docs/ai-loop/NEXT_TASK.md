```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by targeting core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on key CRUD and sharing operations.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes to export functions for testing, if necessary, but primarily for testing)
-   `src/lib/__tests__/firestore.test.ts` (new test file)
-   `vite.config.ts` (only for minimal Vitest configuration if absolutely required, e.g., for test setup files, but prefer existing config)
-   `src/` (general usage, but specific to testing `firestore.ts`)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Modifying UI components directly (unless strictly necessary for testing `firestore.ts` indirectly, which is unlikely for this task).

## Requirements

-   **Create a new test file:** `src/lib/__tests__/firestore.test.ts`.
-   **Implement unit tests:** Write comprehensive unit tests for the primary Firestore helper functions exposed by `src/lib/firestore.ts`. These should include, but not be limited to, functions related to:
    *   Adding, getting, updating, and deleting `nailItems`.
    *   Getting, adding, and deleting `publicShares`.
-   **Mock Firebase SDK:** Utilize `vitest`'s mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore` functions like `doc`, `collection`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`). Tests must be isolated unit tests, not integration tests that hit actual Firebase services.
-   **Pass all tests:** Ensure all newly created tests pass successfully when running `npm run test`.
-   **Code Quality:** The new code must adhere to existing coding standards.
-   **Linter & Build:** Run `npm run build && npm run lint` before finishing and resolve any issues.
-   **Diff Size:** Keep the diff for the Pull Request ≤ 150 lines.
-   **Follow-up Items:** Report any limitations or potential improvements for future tasks as comments within the PR description.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
