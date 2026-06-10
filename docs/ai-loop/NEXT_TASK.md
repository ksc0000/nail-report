# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key area is adding unit tests for core helper functions.

## Objective

Implement unit tests for the functions in `src/lib/firestore.ts` using Vitest. Focus on the core CRUD operations for `nailItems` and `publicShares`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting internal functions for testing, but prefer not to alter functionality)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minimal modifications if absolutely required for mocking, but prefer to mock within test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as needed to isolate `firestore.ts` logic.
- Cover basic CRUD operations (add, get, update, delete) for at least `nailItems` or `publicShares` collection.
- Run `npm run build && npm run lint && npm test` before finishing. All commands must pass.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
