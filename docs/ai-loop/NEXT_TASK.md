```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines a clear path through several phases. Phase 1 is complete, and Phase 2, focused on improving stability, test coverage, and UX, is currently active. The immediate goal is to enhance test coverage, specifically for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering basic CRUD operations and data marshalling functions.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize testing existing exports)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (only if adding `vitest` as a `devDependency` is absolutely required and fits within the line limit and `no-new-npm-deps` constraint, but assume it's already present for testing)
-   `vite.config.ts` (if minimal Vitest configuration is required)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` (do not add *new* npm packages beyond what's implied for Vitest setup, if any)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`

## Requirements

-   Keep diff ≤ 150 lines.
-   Add a new test file `src/__tests__/firestore.test.ts`.
-   Cover key functions in `src/lib/firestore.ts` such as `createNailItem`, `getNailItems`, `updateNailItem`, and `deleteNailItem` (or similar core helpers).
-   Use Vitest for testing and mock Firebase SDK where necessary (e.g., Firestore functions).
-   Ensure tests are isolated and do not interact with live Firebase resources.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
```
