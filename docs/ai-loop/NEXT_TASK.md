# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for the core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK calls. The initial focus should be on CRUD operations for `nailItems`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer testing existing exports)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor configuration changes for test setup if absolutely required for mocking, but prefer existing setup)

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
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock the Firebase Firestore SDK using `vi.mock` as demonstrated in existing test examples or Vitest documentation for mocking modules.
- Write unit tests for at least two key functions in `src/lib/firestore.ts`, such as `createNailItem` and `getNailItem`.
- Ensure tests cover successful operations and basic error handling for the mocked Firebase calls.
- Do not modify existing application logic in `src/lib/firestore.ts` unless it's a minor change to make a function testable without altering its public API or behavior.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
