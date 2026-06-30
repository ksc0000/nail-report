# Worker Prompt Template

## Context

The current phase is focusing on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" goal by adding unit tests for critical Firebase helper functions.

## Objective

Add unit tests using Vitest for the functions within `src/lib/firestore.ts`. Focus on covering the main CRUD operations and utility functions in this file.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (for minor adjustments to test setup, if necessary, assuming Vitest is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to enable isolated testing of `firestore.ts` functions.
- Cover basic CRUD operations (add, get, update, delete) and any specific helper logic in `firestore.ts`.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
