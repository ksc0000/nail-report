# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates we are at the beginning of Phase 2 with no completed tasks. The goal is to enhance test coverage for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task focuses on establishing a testing foundation for our Firebase-related logic.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no functional changes)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (minimal configuration changes related to Vitest if absolutely necessary, but prioritize using existing setup)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for `vite.config.ts` if strictly necessary for Vitest configuration.

## Requirements

-   Create a new test file, `src/__tests__/firestore.test.ts`.
-   Write comprehensive unit tests for the functions exported from `src/lib/firestore.ts`.
-   Mock Firebase SDK interactions using `vi.mock` as appropriate to ensure tests are isolated and fast.
-   Aim for good branch and statement coverage for the tested functions.
-   Keep the total diff size for the PR ≤ 150 lines.
-   Run `npm run build && npm run lint && npm test` before finishing and ensure all pass.
-   Report any follow-up items or identified issues as comments in your PR description.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
