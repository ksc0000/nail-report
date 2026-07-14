# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on Phase 2, which involves improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firebase utility functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the explicitly allowed scope.

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two key helper functions in `src/lib/firestore.ts`. Examples include functions for adding, updating, or deleting nail items.
- Use `vitest` for testing and `vi.mock` for mocking Firebase SDK dependencies as necessary.
- Ensure the tests cover basic functionality and edge cases.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
