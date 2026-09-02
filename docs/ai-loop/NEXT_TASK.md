# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. This task specifically addresses the test coverage aspect by adding unit tests for core helper functions.

## Objective

Implement Vitest unit tests for the helper functions located within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions or small refactors to enable testing, if necessary)
-   `src/__tests__/lib/firestore.test.ts` (new test file)
-   `vite.config.ts` (minor additions for Vitest setup if absolutely required, but assume Vitest is mostly configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval; assume Vitest is already installed as a dev dependency)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except `vite.config.ts` if strictly necessary for Vitest.

## Requirements

-   Keep diff ≤ 150 lines.
-   Focus on testing the exported functions in `src/lib/firestore.ts`.
-   Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
-   Create a new test file named `src/__tests__/lib/firestore.test.ts`.
-   Ensure tests cover typical scenarios for at least two key functions (e.g., fetching items, adding an item).
-   Run `npm run build && npm run lint` before finishing.
-   Run `npm test` to confirm tests pass.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
