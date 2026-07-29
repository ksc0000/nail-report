# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. The first sub-phase (2.1) is dedicated to test coverage, specifically unit tests for Firebase helper functions. Vitest is the chosen test runner. This task directly addresses the first item in Phase 2.1.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, e.g., named exports)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (only if adding a `test` script, no new dependencies)
-   `vite.config.ts` (if Vitest setup is not yet complete)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file `src/__tests__/firestore.test.ts`.
-   Write unit tests for at least two core CRUD functions within `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`.
-   Mock the Firebase SDK (Firestore `doc`, `collection`, `getDoc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`) using `vitest.mock` to isolate the functions under test from actual Firebase calls.
-   Ensure tests cover successful execution paths for the selected functions.
-   Keep the diff ≤ 150 lines.
-   Run `npm run test` (or `vitest` if configured directly) and `npm run build && npm run lint` before finishing.
-   Add a `test` script to `package.json` if one doesn't exist to run Vitest tests.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
