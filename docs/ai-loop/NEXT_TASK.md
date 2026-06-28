# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. A core part of this phase is adding unit tests, starting with helper functions. `src/lib/firestore.ts` contains crucial logic for interacting with Firebase Firestore.

## Objective

Implement initial unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mock Firebase SDK interactions.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes if needed to make functions testable, but primarily `src/__tests__/` focus)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `src/__tests__/__mocks__/firebase.ts` (new file for Firebase SDK mocks, if desired, or inline `vi.mock` in test file)
-   `vite.config.ts` (if Vitest configuration is needed, but prefer to assume it's already set up for basic tests)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   Any files outside of `src/` except for potential `vite.config.ts` if strictly necessary for Vitest setup.

## Requirements

-   Keep diff ≤ 150 lines. Focus on testing one or two simple, isolated helper functions first.
-   Create a new test file: `src/__tests__/lib/firestore.test.ts`.
-   Use Vitest for writing tests.
-   Mock Firebase SDK (`firebase/firestore`, `firebase/app`) interactions using `vi.mock` to ensure tests are truly unit tests and don't hit actual Firebase services.
-   Ensure `npm run test` (or `vitest`) runs successfully and passes the new tests.
-   Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.
-   Report follow-up items as comments in the PR, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task
