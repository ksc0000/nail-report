# Worker Prompt Template

## Context

The product roadmap outlines "Phase 2.1 Test coverage" as an active goal, specifically mentioning unit tests for Firebase helper functions in `src/lib/firestore.ts`, `src/lib/storage.ts`, and `src/lib/auth.ts` using Vitest. This task focuses on the Firestore helpers.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors to improve testability)
- `src/__tests__/` (for creating new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions for coverage configuration if necessary)
- `package.json` (only if adding `test` script, no new npm dependencies)

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
- Mock the Firebase SDK (e.g., `firebase/firestore`) using `vi.mock` to isolate `firestore.ts` functions.
- Write tests for core CRUD operations: `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, and any other significant helper functions in `src/lib/firestore.ts`.
- Ensure test cases cover successful operations and likely failure scenarios (e.g., Firestore errors).
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt for Jules:**

Please create a new test file `src/__tests__/firestore.test.ts` and add unit tests for the helper functions in `src/lib/firestore.ts`. Use Vitest for testing and mock the Firebase SDK (`firebase/firestore`) appropriately to ensure `firestore.ts` functions are tested in isolation. Focus on covering the main CRUD operations (`addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) and any other utility functions present. Your solution should adhere to the specified allowed and forbidden scopes and keep the diff size minimal (≤150 lines). Ensure `npm run build`, `npm run lint`, and `npm test` all pass.

**Acceptance Criteria:**

1.  A new file `src/__tests__/firestore.test.ts` exists.
2.  `src/lib/firestore.ts` has a reasonable set of unit tests covering its primary functions.
3.  The Firebase SDK is mocked to prevent actual database calls during tests.
4.  All tests pass when running `npm test`.
5.  No new `npm` dependencies are introduced.

**Required Test Commands:**
```bash
npm install # Ensure dev dependencies are installed, especially vitest
npm run build
npm run lint
npm test
```
