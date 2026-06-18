# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX. The current task is to begin implementing unit tests for the application's helper functions, specifically targeting Firebase Firestore interactions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, ensuring Firebase SDK calls are appropriately mocked.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability, e.g., exports)
-   `src/lib/__tests__/firestore.test.ts` (new file for unit tests)
-   `vite.config.ts` (minor configuration if necessary to enable Vitest setup for these tests, e.g., `setupFiles` for mocks)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file: `src/lib/__tests__/firestore.test.ts`.
-   Implement unit tests for at least **two significant helper functions** within `src/lib/firestore.ts`. Examples include `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
-   Utilize Vitest's mocking capabilities (e.g., `vi.mock('firebase/firestore')`) to isolate the `firestore.ts` functions from actual Firebase service calls during testing.
-   Ensure the tests cover success and basic error scenarios for the chosen functions.
-   Keep the overall change set (diff) under 150 lines.
-   Run `npm test` successfully before finishing.
-   Run `npm run build && npm run lint` successfully before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
