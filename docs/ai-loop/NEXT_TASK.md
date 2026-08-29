# Worker Prompt Template

## Context

Phase 2 of the roadmap is active, focusing on improving stability, test coverage, and UX. This task directly addresses the "Test coverage" goal by adding initial unit tests for core Firestore helper functions. Improving test coverage is a high priority for overall application stability.

## Objective

Implement Vitest unit tests for selected helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, but primarily for testing existing functions)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
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

## Worker Prompt

Your task is to add Vitest unit tests for specific helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the `firebase/firestore` module and any other Firebase SDK dependencies to isolate `src/lib/firestore.ts` functions for testing.
3.  **Test key functions:** Write unit tests for at least two core functions in `src/lib/firestore.ts` that interact with Firestore. Good candidates include:
    *   `addNailItem` (or a similar function responsible for creating a new document).
    *   `getNailItems` (or a similar function responsible for fetching a collection).
    *   Focus on testing the logic within these functions, assuming the mocked Firestore interactions behave as expected.
4.  **Run tests:** Ensure your newly added tests pass by running `npm run test`.
5.  **Lint and Build:** Before concluding, ensure `npm run lint` and `npm run build` pass without errors.

**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- The test file includes `vi.mock` for `firebase/firestore`.
- At least two functions from `src/lib/firestore.ts` have dedicated unit tests.
- All tests pass when running `npm run test`.
- `npm run lint` and `npm run build` complete without errors.
