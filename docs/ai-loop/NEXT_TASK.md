# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability only, if needed)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, keep changes minimal)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add initial unit test coverage for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Implement tests:**
    *   Add tests for key functions such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem`.
    *   Focus on mocking the Firebase SDK (Firestore specifically) using `vi.mock` to isolate the `firestore.ts` functions for unit testing.
    *   Ensure tests cover successful execution paths.
    *   Consider adding basic tests for error conditions if easily mockable (e.g., Firestore throwing an error during an operation).
3.  **No modification of `firestore.ts`:** Avoid modifying `src/lib/firestore.ts` unless a very minor refactor (e.g., exporting a non-exported helper) is absolutely necessary to enable testing. If so, keep it minimal.
4.  **No Vitest installation:** Assume Vitest is already configured. Do not install new npm packages. If Vitest configuration is missing, add minimal setup to `vite.config.ts` to allow running tests in `src/__tests__/`.
5.  **Run tests:** Ensure the newly added tests run successfully.
6.  **Lint and Build:** Verify the project builds and lints correctly after your changes.

This task aims for initial, meaningful test coverage, not 100% coverage for all edge cases at this stage.

## Suggested next task

Add loading skeleton to nail item list (`src/App.tsx`)
