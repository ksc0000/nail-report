# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically targets improving test coverage for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering basic CRUD operations and data transformation logic present in the file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but focus on testing existing logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (add Vitest configuration if missing, but no new npm dependencies)
- `vite.config.ts` (add Vitest configuration if missing)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts` for the unit tests.
- Mock Firebase SDK dependencies using `vitest`'s mocking capabilities as needed (e.g., `vi.mock('firebase/firestore')`).
- Cover at least two distinct helper functions in `src/lib/firestore.ts` with unit tests.
- Ensure tests are clean, readable, and focused on single responsibilities.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
