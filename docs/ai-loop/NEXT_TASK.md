# Worker Prompt Template

## Context

The current phase is "2.0 Improve stability, test coverage, and UX". A key goal is to increase test coverage. The roadmap specifies Vitest as the test runner.

## Objective

Implement unit tests for helper functions located in `src/lib/firestore.ts` using Vitest. This task focuses specifically on testing the functions within this file, ensuring their correctness and robustness.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability, if strictly necessary)
-   `src/lib/__tests__/firestore.test.ts` (new file for tests)
-   `src/lib/__mocks__/firebase.ts` (new file for mocking Firebase SDK, if needed)
-   `vite.config.ts` (minor modifications for test configuration, if strictly necessary)
-   `package.json` (no new dependencies, but existing scripts can be used or modified for testing)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/lib/` or test configuration files.

## Requirements

-   Create a new test file: `src/lib/__tests__/firestore.test.ts`.
-   Write comprehensive unit tests for the functions exported from `src/lib/firestore.ts`.
-   Ensure Firebase SDK calls are appropriately mocked using `vitest` and `vi.mock()` to isolate unit tests from actual Firebase services.
-   Aim for high code coverage for `src/lib/firestore.ts`.
-   Keep diff ≤ 150 lines.
-   Run `npm test`, `npm run build && npm run lint` before finishing and ensure all pass.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
