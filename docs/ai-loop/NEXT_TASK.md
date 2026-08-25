```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on stability, test coverage, and UX improvements. This task directly addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase utility functions.

## Objective

Implement Vitest unit tests for a subset of the helper functions within `src/lib/firestore.ts`. Focus on `getNailItem` and `deleteNailItem` to establish a testing pattern and ensure the PR remains small.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection, **do not modify its logic**)
- `src/__tests__/` (create new test files, specifically `src/__tests__/lib/firestore.test.ts`)
- `src/vitest.setup.ts` (if minor setup is needed for Firebase mocks, but prefer inline mocks if possible for simplicity)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Modifying the actual implementation logic of `src/lib/firestore.ts`

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for `getNailItem` and `deleteNailItem` from `src/lib/firestore.ts`.
- Mock Firebase SDK methods (e.g., `doc`, `getDoc`, `deleteDoc`) using `vitest`'s `vi.mock` to ensure tests are isolated and do not interact with a real Firebase instance.
- Ensure the tests cover the happy path (successful data retrieval/deletion).
- Keep the diff ≤ 150 lines.
- Run `npm run test` and ensure all new tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
