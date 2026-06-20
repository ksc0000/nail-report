# Worker Prompt Template

## Context

Phase 2 of the roadmap focuses on improving stability, test coverage, and UX. The first item in this phase is to add unit tests for Firebase helper functions. `src/lib/firestore.ts` contains critical functions for interacting with the Firestore database. Adding tests for these functions will increase code reliability and prevent regressions.

## Objective

Add Vitest unit tests for the core helper functions in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to improve testability, if strictly necessary, such as exporting functions. Prefer not to modify if possible.)
- `src/__tests__/lib/firestore.test.ts` (new test file)
- `package.json` (only to ensure a `test` script exists and runs Vitest, if not already configured. No new dependencies.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two key functions from `src/lib/firestore.ts`, such as `getNailItem`, `createNailItem`, `updateNailItem`, `deleteNailItem`, or `getPublicShare`.
- Use Vitest as the test runner and mock Firebase SDK functions (e.g., `vi.mock('firebase/firestore')`) as needed to isolate the logic being tested.
- Focus on testing the core logic and interactions with the mocked Firebase SDK.
- Ensure the tests cover successful operations and basic error scenarios where appropriate.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report any follow-up items or assumptions made as comments within the PR description.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
