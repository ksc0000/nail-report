# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses the "2.1 Test coverage" goal, aiming to improve the robustness of the application's core logic by adding unit tests for Firebase helper functions. Vitest is already the chosen test runner.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, including mocking the Firebase SDK where necessary.

## Allowed Scope

-   `src/lib/firestore.ts` (for minor adjustments to enable testing, e.g., named exports)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `src/__mocks__/firebase.ts` (or similar, for Firebase SDK mocks if needed)
-   `vite.config.ts` (only if Vitest configuration for mocks is strictly necessary)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css` (not relevant to this task)

## Requirements

-   Create `src/__tests__/firestore.test.ts` to house the new unit tests.
-   Write tests that cover at least `addNailItem`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
-   Utilize Vitest's mocking capabilities (`vi.mock`) to simulate Firebase Firestore SDK behavior without actual database calls.
-   Ensure tests are isolated and do not rely on a live Firebase environment.
-   Keep the total diff for the PR to ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing, and ensure all pass.
-   If `firestore.ts` functions are not exported in a way that allows easy testing (e.g., default export), refactor them to named exports, keeping the changes minimal.
-   Report any necessary follow-up items (e.g., helper functions that could not be easily tested due to their structure) as comments.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
