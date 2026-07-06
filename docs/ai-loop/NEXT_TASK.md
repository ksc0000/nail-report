# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2, focusing on stability, test coverage, and UX, is currently active. A key objective in Phase 2.1 is to improve test coverage, specifically by adding unit tests for Firebase helper functions using Vitest and `vi.mock` for the Firebase SDK. This task aims to kickstart this effort by targeting a specific set of helper functions. Vitest is assumed to be already configured in the project as per the roadmap.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on core CRUD operations.

## Allowed Scope

-   `src/lib/firestore.ts` (for inspection of functions to test)
-   `src/__tests__/` (for new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `package.json` (only to verify Vitest configuration, no new dependencies)
-   `vite.config.ts` (only to verify Vitest configuration, no new dependencies)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except where explicitly allowed for configuration verification.

## Requirements

-   Keep diff ≤ 150 lines.
-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least two core helper functions within `src/lib/firestore.ts` (e.g., `addItem`, `getItem`, `updateItem`, `deleteItem`, or similar data manipulation functions).
-   Mock the Firebase SDK (Firestore methods) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
-   Ensure tests cover both successful execution and potential error scenarios where applicable (e.g., a failed Firestore operation).
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
