# Worker Prompt Template

## Context

The project is currently in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. The current objective is to enhance test coverage for core utility functions.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. Focus on testing at least 2-3 key functions in this file.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to export functions if needed for testing, but prefer not to modify core logic)
- `src/__tests__/` (creation of new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if Vitest scripts need modification, no new dependencies)
- `vite.config.ts` (only for minor Vitest configuration if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, for example, `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock` from Vitest.
- Test at least 2-3 core helper functions within `src/lib/firestore.ts` that involve Firestore operations.
- Ensure the tests cover typical success and error scenarios where applicable.
- Run `npm run test` to verify the new tests pass.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
