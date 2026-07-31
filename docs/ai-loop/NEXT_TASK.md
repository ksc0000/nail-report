# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage efforts by adding unit tests for a core Firebase helper file.

## Objective

Add unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not to alter production code)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only if absolutely necessary for Vitest configuration, unlikely)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Ensure tests cover the main helper functions (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.)
-   Mock Firebase SDK interactions using `vi.mock` as appropriate to isolate unit tests.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
