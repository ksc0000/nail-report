# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The current task is to begin adding unit test coverage, starting with core utility functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, but keep logic changes minimal)
- `src/__tests__/firestore.test.ts` (new file for tests)
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
- Write unit tests for at least 2-3 helper functions in `src/lib/firestore.ts`. Focus on functions that perform data transformation or simple logic rather than direct Firebase SDK calls (which require mocking). Examples might include functions related to data parsing, validation, or utility transformations before/after Firestore operations.
- Use Vitest's mocking capabilities if necessary to isolate functions from direct Firebase SDK interactions.
- Ensure all tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
