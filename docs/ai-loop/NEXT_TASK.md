# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage improvements by adding unit tests for core Firebase interactions. Vitest is designated as the test runner.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testability if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any files outside of `src/lib/firestore.ts` and `src/__tests__/lib/firestore.test.ts`

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

## Worker Prompt

### Summary of what changed

Added a new test file `src/__tests__/lib/firestore.test.ts` containing Vitest unit tests for the helper functions in `src/lib/firestore.ts`. The tests cover basic Firestore CRUD operations (add, get, update, delete) for nail items, using mocked Firebase SDK functions.

### Changed files list

- `src/lib/firestore.ts` (potentially minor refactorings for testability, if needed)
- `src/__tests__/lib/firestore.test.ts` (new file)

### Commands run and results

```bash
npm test
# Expected output: All tests pass, showing coverage report for src/lib/firestore.ts

npm run build && npm run lint
# Expected output: Build successful, no linting errors
```

### Known issues or limitations

- Currently, only the core `firestore.ts` helpers are covered. Other `lib` files (e.g., `storage.ts`, `auth.ts`) still lack unit tests.
- The Firebase SDK is mocked for these tests, so integration with an actual Firestore instance is not verified by these unit tests.

### Suggested next task

Add Vitest unit tests for `src/lib/storage.ts` helpers, focusing on image upload and deletion logic.
