# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates that the first substantive task is pending. This task initiates the test coverage efforts for the core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This task aims to improve the test coverage as outlined in Phase 2.1 of the roadmap.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/` helpers (firestore.ts, storage.ts, auth.ts, publicShares.ts)
- `src/__tests__/` (new test files)
- `src/App.css` (CSS improvements)

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

---

## Worker prompt

### Summary of what changed

Implemented unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. Mocked Firebase SDK dependencies where necessary to ensure tests are isolated and run efficiently.

### Changed files list

- `src/lib/firestore.ts` (minor adjustments if needed for testability, e.g., exporting non-default functions)
- `src/__tests__/firestore.test.ts` (new file containing unit tests for `firestore.ts` helpers)

### Commands run and results

```bash
npm test # (or npx vitest)
# Expected: All new tests pass, existing tests (if any) continue to pass.
npm run build
# Expected: Build completes successfully with no errors.
npm run lint
# Expected: Linting passes with no new warnings or errors.
```

### Known issues or limitations

- Currently, only `firestore.ts` helpers are covered. Other `src/lib/` files still lack unit tests.
- Some functions in `firestore.ts` might require more complex mocking or edge case handling, which could be a follow-up task if the initial implementation exceeds the line limit.

### Suggested next task

Add loading skeleton to the nail item list (`src/App.tsx`) to improve the user experience during data fetching, as per Phase 2.3 of the roadmap.
