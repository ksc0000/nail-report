# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage. The goal is to add unit tests for critical helper functions.

## Objective

Implement unit tests for the functions defined in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK interactions to test the internal logic of these helpers.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring to improve testability, if necessary)
- `src/__tests__/` (e.g., `src/__tests__/firestore.test.ts` for new test files)
- `vitest.config.ts` (if minimal configuration changes are required for new tests)

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
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Use `vi.mock` to mock Firebase SDK functions (e.g., `firebase/firestore`).
- Cover common scenarios for `addNailItem`, `updateNailItem`, `deleteNailItem`, etc., ensuring data transformation and calls to Firebase SDK are correct.
- Ensure tests are isolated and do not rely on actual Firebase calls.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new test file `src/__tests__/firestore.test.ts` exists.
- The functions in `src/lib/firestore.ts` have basic unit test coverage.
- Firebase SDK interactions are mocked using Vitest.
- All tests pass (`npm run test`).

**Required Test Commands:**
```bash
npm install # if starting fresh
npm run build
npm run lint
npm run test
```
