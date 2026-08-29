# Worker Prompt Template

## Context

The product roadmap for nail-report is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1 (Test coverage) by adding unit tests for core Firebase helper functions.

## Objective

Implement initial Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. Focus on functions that perform straightforward data manipulation or Firestore query construction, such as those related to creating, reading, updating, or deleting nail items.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/*.test.ts` (other new test files, if deemed necessary for mocking setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add at least 2-3 unit tests covering distinct helper functions in `src/lib/firestore.ts`.
- Use Vitest and mock the Firebase SDK (Firestore methods) as needed to isolate the logic being tested.
- Ensure the tests are self-contained and do not make actual calls to Firebase.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Acceptance Criteria:**
- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains at least 2 passing unit tests for functions from `src/lib/firestore.ts`.
- Firebase SDK calls are mocked in the tests.
- The PR diff is within the specified line limit.

**Required Test Commands:**
```bash
npm test
npm run build
npm run lint
```
