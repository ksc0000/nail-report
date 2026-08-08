# Worker Prompt Template

## Context

The current roadmap (Phase 2.1) focuses on improving test coverage. This task will initiate unit testing for core helper functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not to alter functionality)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest configuration is needed, but prefer to use existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (no CSS changes for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Add comprehensive unit tests for the functions in `src/lib/firestore.ts`, focusing on input/output and error conditions.
- Ensure all new tests pass by running `npm run test`.
- Mock Firebase SDK dependencies as needed using `vitest`'s mocking capabilities to ensure isolated unit tests.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
