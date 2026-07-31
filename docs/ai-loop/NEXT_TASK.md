# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor adjustments if necessary for testability)
-   `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `package.json` (only to add a `test` script if not already present, pointing to `vitest`)
-   `vite.config.ts` (for Vitest configuration, if needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, `vitest` should already be present if a `test` script is added)
-   Firebase deploy commands
-   Secrets and credentials
-   Modifications to any UI components (e.g., `src/App.tsx`, `src/components/`)
-   `src/App.css` or other CSS files

## Requirements

-   Create a new test file named `src/__tests__/firestore.test.ts`.
-   Write unit tests for the core helper functions exported from `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, and any other significant data manipulation functions.
-   Mock the Firebase SDK (Firestore, Auth, Storage) as necessary using `vi.mock` to ensure tests are isolated and do not interact with a live Firebase project.
-   Ensure tests cover typical success cases and relevant error paths (if easily testable without major refactoring of `firestore.ts`).
-   Keep the diff ≤ 150 lines.
-   Run `npm run build`, `npm run lint`, and `npm run test` before finishing. Ensure all commands pass.
-   The task `First substantive task pending (Issue #135)` will be fulfilled by completing this.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
