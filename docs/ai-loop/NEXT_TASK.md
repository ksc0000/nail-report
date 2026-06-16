```markdown
# Worker Prompt Template

## Context

The current focus is on Phase 2 of the roadmap, specifically improving stability and test coverage. This task aims to increase test coverage for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments might be needed for testability, e.g., exporting non-exported functions, but prioritize testing existing public exports)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (other new test files as needed for mocking setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use Vitest for writing tests.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) appropriately to isolate `firestore.ts` logic.
- Ensure key helper functions in `src/lib/firestore.ts` have basic unit test coverage (e.g., functions for adding, updating, deleting nail items).
- Report any follow-up items as comments in the PR, not as additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
