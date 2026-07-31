# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no functional changes)
- `src/__tests__/` (create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if absolutely necessary for Vitest setup, like adding a `test` script, but prioritize existing setup if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions within `src/lib/firestore.ts`, such as `createNailItem` and `getNailItems`.
- Mock Firebase SDK dependencies using `vi.mock` as necessary to isolate the functions under test.
- Ensure tests cover basic success cases and error handling (if applicable and easily testable without complex mocks).
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
