# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state indicates that no specific implementation task from the "Jules-ready Tasks" list has been started yet. This task focuses on improving test coverage for core utility functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a test file)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside the `src/` directory (except for `.gitignore` or similar non-code configuration if absolutely necessary, but not expected for this task).

## Requirements

-   Create a new test file (e.g., `src/__tests__/firestore.test.ts`).
-   Write unit tests for the key helper functions in `src/lib/firestore.ts` that interact with Firestore (e.g., functions for adding, fetching, updating, or deleting `nailItems`).
-   Use `vitest` for the test runner.
-   Mock Firebase SDK interactions using `vi.mock` where necessary to isolate the unit under test.
-   Ensure the tests cover happy paths and common error scenarios for these functions.
-   Keep the diff for the PR to ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing. All commands must pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
