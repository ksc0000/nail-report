# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state indicates that initial AI-loop setup is complete, and a substantive task is pending. This task will kickstart the test coverage efforts for the core application logic.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK appropriately.

## Allowed Scope

-   `src/lib/firestore.ts` (for potential minor adjustments to aid testability, but primarily for understanding functions to test)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/vite-env.d.ts` (if Vitest globals need declaration)
-   `vite.config.ts` (for minimal Vitest configuration if required, e.g., adding `test` block)
-   `package.json` (for adding/modifying a `test` script to run Vitest, if not already configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, Vitest should be assumed as an existing dev dependency or minimal config is allowed if it does not add new deps)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files not explicitly listed in "Allowed Scope"

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Focus on creating a new test file `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least two helper functions from `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`).
-   Properly mock Firebase SDK (e.g., `firebase/firestore`, `firebase/auth`) using `vitest.mock` to ensure tests are isolated and do not interact with actual Firebase services.
-   Ensure the tests are clear, concise, and cover basic functionality for the chosen functions.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
