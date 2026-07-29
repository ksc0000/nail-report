# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 is focused on improving test coverage. The current state shows no unit tests for `src/lib/firestore.ts` have been implemented yet. This task aims to address that gap.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily testing existing exports)
- `src/__tests__/lib/firestore.test.ts` (new test file)
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
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for the functions exported from `src/lib/firestore.ts`.
- Use Vitest and mock Firebase SDK dependencies as needed.
- Focus on testing the logic of the helper functions, not the Firebase SDK itself.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
