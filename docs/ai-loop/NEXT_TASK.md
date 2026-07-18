# Worker Prompt Template

## Context

The current phase is "2.0 - Active", focusing on improving stability, test coverage, and UX. This task initiates the "2.1 Test coverage" sub-phase by adding unit tests to core utility functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. The focus should be on covering the main CRUD operations or data transformation functions within this file.

## Allowed Scope

- `src/lib/firestore.ts` (for minor modifications if necessary for testability, e.g., exporting non-exported functions, but prefer not to alter functionality)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies as needed using Vitest's mocking capabilities.
- Ensure tests run successfully using `npm test`.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
### Worker prompt

### Summary of Changes

The worker will add a new test file `src/__tests__/firestore.test.ts` and implement unit tests for selected functions within `src/lib/firestore.ts`. These tests will mock Firebase Firestore dependencies using Vitest.

### Changed Files

- `src/__tests__/firestore.test.ts` (new file)
- Potentially `src/lib/firestore.ts` (for minor, non-functional adjustments to improve testability, if strictly necessary, such as exporting functions that were not previously exported).

### Commands Run and Results

The worker should execute the following commands and report their outputs:

1.  `npm test`
    *   Expected result: All new tests pass.
2.  `npm run build`
    *   Expected result: Build completes successfully without errors.
3.  `npm run lint`
    *   Expected result: Linting passes without errors.

### Known Issues or Limitations

None anticipated for this specific task. The mocking strategy for Firebase should be robust enough to avoid external dependencies.

### Suggested Next Task

Implement a loading skeleton component for the nail item list (`src/App.tsx` and associated components) to improve user experience during data fetching. This addresses Phase 2.3 of the roadmap.
