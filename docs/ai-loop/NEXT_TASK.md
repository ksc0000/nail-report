# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key item in this phase is to increase test coverage, starting with core helper functions. This task specifically targets the Firebase Firestore helper functions.

## Objective

Add unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, including mocking the Firebase SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer not to alter core logic)
-   `src/__tests__/firestore.test.ts` (new file)
-   `package.json` (only to add a `test` script if not already present for Vitest, but **no new dependencies**)
-   `vite.config.ts` (for Vitest configuration if necessary, but keep changes minimal)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file, `src/__tests__/firestore.test.ts`.
-   Write unit tests for the functions within `src/lib/firestore.ts` (e.g., functions for adding, retrieving, updating, and deleting nail items).
-   Utilize Vitest's mocking capabilities (`vi.mock`) to mock the Firebase SDK (`firebase/firestore`).
-   Ensure tests cover typical success cases and relevant error scenarios for the helper functions.
-   Keep the diff for this task ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report any necessary follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
