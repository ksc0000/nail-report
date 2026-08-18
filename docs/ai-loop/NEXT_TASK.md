# Worker Prompt Template

## Context

The product roadmap outlines Phase 2 focused on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for a core utility file.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `package.json` (only if adding a new script for tests, but no new dependencies)
- `vite.config.ts` (if Vitest config needs adjustment)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary using `vitest + vi.mock`.
- Focus on testing the helper functions' logic, not Firebase interactions directly (as they will be mocked).
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

1.  Create a new test file: `src/__tests__/lib/firestore.test.ts`.
2.  Import the functions from `src/lib/firestore.ts` into the new test file.
3.  Use `vi.mock` to mock necessary Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) to ensure tests are isolated and do not interact with actual Firebase services.
4.  Write `describe` blocks and `it` tests to cover the main logic of the helper functions. Focus on happy paths and basic error handling where applicable.
5.  Ensure the tests run correctly using `npm test` and pass.
6.  Ensure `npm run build` and `npm run lint` pass.
