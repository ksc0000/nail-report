# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The first sub-phase in this active phase is "2.1 Test coverage". The current state indicates that Vitest is the chosen test runner and the goal is to add unit tests for helper functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts`. The focus should be on establishing a testing pattern for these utility functions, including mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor configuration for mock setup if absolutely required for `src/lib/firestore.ts` testing, but prefer using inline mocks in tests)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Ensure Vitest is used for testing.
- Firebase SDK dependencies (e.g., `firebase/firestore`) must be mocked appropriately.
- Tests should be isolated unit tests, not integration tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- At least one key helper function from `src/lib/firestore.ts` (e.g., a function for adding, getting, or updating a nail item) has comprehensive unit tests.
- Mocks for Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `query`, `getDocs`) are correctly implemented using `vi.mock` or similar Vitest mocking utilities.
- All newly added tests pass when `npm run test` is executed.

## Required Test Commands

```bash
npm run test
npm run build
npm run lint
```
