# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that no substantive feature tasks have been completed or are in progress yet, allowing us to pick the first high-priority task from the "Jules-ready Tasks" list.

## Objective

Implement initial unit tests for key helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on `addNailItem` and `getNailItems` or similar core CRUD functions. This task aims to kickstart the test coverage aspect of Phase 2.1.

## Allowed Scope

-   `src/lib/firestore.ts` (for reading function signatures to be tested)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (if minimal Vitest configuration is required, e.g., to define test environment or globals for mocks, but prefer to keep changes here to an absolute minimum)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep the total diff (additions + deletions) for the PR ≤ 150 lines.
-   Create a new test file: `src/__tests__/firestore.test.ts`.
-   Use `vitest` for writing tests. `vitest` is assumed to be already installed and configured.
-   Mock the Firebase SDK (specifically `firestore` related imports) to isolate the `firestore.ts` functions from actual Firebase calls. Use `vi.mock` effectively.
-   Write at least two basic unit tests for functions like `addNailItem` and `getNailItems` from `src/lib/firestore.ts`, ensuring they correctly interact with their mocked Firebase dependencies.
-   Run `npm run build && npm run lint && npm test` before finishing to ensure code quality and test pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
