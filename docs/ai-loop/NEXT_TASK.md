# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. A key item is to increase test coverage for core utility functions. This task specifically targets `src/lib/firestore.ts`.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on ensuring robust testing of Firestore-related operations by mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring to enable testing if necessary, e.g., exporting functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest setup needs adjustment for Firestore mocks)

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

## Acceptance Criteria

1.  A new test file, `src/__tests__/firestore.test.ts`, is created.
2.  At least one significant helper function (e.g., related to CRUD operations on `nailItems` or `publicShares`) from `src/lib/firestore.ts` has dedicated unit tests.
3.  The Firebase SDK (e.g., `firebase/firestore`) is properly mocked using `vi.mock` to isolate the unit under test from actual Firebase calls.
4.  All added tests pass when running `npm test`.

## Required Test Commands

- `npm run build`
- `npm run lint`
- `npm test`
