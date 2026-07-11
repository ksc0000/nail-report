# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task initiates the test coverage goal by adding unit tests for critical Firebase helper functions.

## Objective

Implement Vitest and add unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/` (create new test files for `firestore.ts`)
- `vite.config.ts` (add Vitest configuration)
- `package.json` (add Vitest scripts, but **no new npm dependencies**)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to integrate Vitest into the project and write unit tests for the functions defined in `src/lib/firestore.ts`.

Specifically:

1.  **Configure Vitest:** Add `vitest` as a test runner. This primarily involves modifying `vite.config.ts` to include Vitest setup and adding a test script to `package.json`. **Do not add new npm packages; assume `vitest` is already available or can be configured without adding it as a *new* dependency in `package.json` if it's already there (it usually is for Vite projects).** If `vitest` needs to be added as a dev dependency, report it as a limitation/follow-up but do not add it yourself. Focus on configuration assuming it's present.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase SDK dependencies within your tests, ensuring tests are isolated and do not interact with actual Firebase services.
3.  **Write Unit Tests:** Create a new test file, e.g., `src/__tests__/firestore.test.ts`, and write comprehensive unit tests for at least two core functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
    *   Verify that these functions correctly interact with the mocked Firestore instance.
    *   Test both successful execution paths and potential error handling paths.
4.  **Acceptance Criteria:**
    *   `npm run test` (or equivalent Vitest command) runs successfully, executing the new tests.
    *   The new tests cover at least two functions in `src/lib/firestore.ts`.
    *   Tests use mocked Firebase services.
    *   `npm run build` completes without errors.
    *   `npm run lint` completes without warnings or errors.
