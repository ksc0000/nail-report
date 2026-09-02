# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. This task focuses on adding tests, not modifying the helper functions themselves, unless absolutely necessary to enable testing.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications to export functions if needed for testing, no logic changes)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `src/__tests__` (new directory if needed for test files)
- `vitest.config.ts` (minor modifications for path aliases or setup, if necessary)
- `package.json` (only to add `test` script if missing or to update an existing one to run vitest)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to isolate `firestore.ts` functions for testing.
- Write unit tests covering at least `getNailItems`, `addNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Ensure tests run successfully with `npm test`.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
