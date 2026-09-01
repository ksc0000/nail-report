# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that no substantive development tasks have been started yet, providing a clean slate to begin addressing Phase 2 objectives. This task will kickstart the "2.1 Test coverage" goal by adding foundational unit tests for core Firebase interactions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

-   `src/lib/firestore.ts` (minor refactors for testability are allowed if absolutely necessary, but prioritize testing existing functions as-is)
-   `src/__tests__/` (add `src/__tests__/firestore.test.ts` for the new tests)
-   `package.json` (only for adding a `test` script if it's missing or updating `test` script to use Vitest, *no new dependencies*)
-   `vite.config.ts` (if Vitest configuration is required)

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
-   Use Vitest for writing the tests.
-   Mock Firebase SDK calls (e.g., Firestore `getDoc`, `setDoc`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure tests are isolated and fast.
-   Focus on the main CRUD operations and helper functions in `src/lib/firestore.ts`.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
