# Worker Prompt Template

## Context

The product is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "Test coverage" goal by adding unit tests to a core utility file.

## Objective

Implement unit tests for a few core helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize minimal changes)
-   `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `vite.config.ts` (only if absolutely necessary for Vitest configuration, but assume Vitest is largely set up)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Focus on testing core CRUD or data transformation functions within `src/lib/firestore.ts`. Aim for 2-3 functions initially to keep the scope small.
-   Use Vitest for testing. Assume Vitest is already configured in the project. If Vitest is not configured, report this as a limitation.
-   Mock Firebase SDK interactions as needed to ensure tests are isolated and fast.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---
**Worker prompt:**

Your task is to add unit tests for a few core helper functions in `src/lib/firestore.ts`.

1.  Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
2.  Identify 2-3 important, testable helper functions in `src/lib/firestore.ts` (e.g., functions for data conversion, parsing, or simple CRUD operations that don't heavily rely on complex Firebase interactions directly).
3.  Write unit tests for these selected functions using Vitest, mocking Firebase SDK dependencies as necessary to ensure isolated testing.
4.  Ensure the tests pass and verify code coverage if possible.
5.  Do not add new npm dependencies. Assume Vitest is already installed and configured. If it's not, document this limitation.

**Acceptance criteria:**
-   New test file `src/__tests__/firestore.test.ts` exists.
-   At least two core helper functions from `src/lib/firestore.ts` have passing unit tests.
-   Tests use Vitest and mock Firebase SDK interactions.

**Required test commands:**
```bash
npm run build
npm run lint
npm run test
```
