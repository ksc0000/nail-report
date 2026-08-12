# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" objective by adding unit tests for a core helper module.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer minimal changes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if adding a `test` script, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, Vitest is assumed to be a dev dependency already)
- Firebase deploy commands
- Secrets and credentials
- Any other files or directories not explicitly listed in "Allowed Scope"

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Focus on writing unit tests for core CRUD functions in `src/lib/firestore.ts` such as `addItem`, `updateItem`, `deleteItem`, `getItem`, `getPublicShares`, etc.
- Mock the Firebase SDK (Firestore specifically) using `vi.mock` as indicated in the roadmap's "Test coverage" section.
- Ensure tests cover basic success and error paths for the mocked functions.
- Keep the diff ≤ 150 lines, focusing on the most critical functions first.
- Run `npm run build && npm run lint && npm run test` before finishing and ensure all commands pass.
- Report any follow-up items or limitations as comments in the PR or in the `NEXT_TASK.md` generated for the next iteration.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
