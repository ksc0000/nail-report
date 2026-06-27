```markdown
# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for core helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task should cover the primary functions for interacting with the `nailItems` collection (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`) or other utility functions in that file, ensuring that the mocking of Firebase SDK is correctly set up for these tests.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are allowed if strictly necessary, but the primary focus is testing it)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (to ensure Vitest setup for mocks is correct)
- `src/App.css` (no changes expected for this task)

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
- Mock the Firebase SDK (Firestore, doc, collection, etc.) using `vi.mock` as necessary for isolated testing.
- Write at least 3-5 distinct test cases covering different aspects of `firestore.ts` functions (e.g., successful data retrieval, addition, update, deletion, or error handling).
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
