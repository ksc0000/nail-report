# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The product is `nail-report`, a React + TypeScript + Vite + Firebase web app for tracking personal nail care history. Phase 2 focuses on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" objective by adding unit tests for Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts` to improve test coverage.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications, e.g., exporting unexported helpers for testing, but no functional changes to existing logic)
- `src/__tests__/firestore.test.ts` (create this new file for tests)
- `package.json` (only to add or modify a `test` script command if necessary, no new `dependencies` or `devDependencies` entries)
- `vite.config.ts` (minimal changes strictly required for Vitest to run these specific tests, if any)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (no new npm packages, i.e., no new entries in `dependencies` or `devDependencies`)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories not explicitly listed in Allowed Scope.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Implement mocking for Firebase SDK (Firestore) interactions using `vi.mock` to isolate `src/lib/firestore.ts` functions during testing.
- Write unit tests for at least two distinct helper functions in `src/lib/firestore.ts` that interact with Firestore. Good candidates include functions for adding data (e.g., `addNailItem`) and fetching data (e.g., `getNailItems`).
- Ensure tests cover basic success cases for the chosen functions.
- All new tests must pass when executed.
- Run `npm run build && npm run lint` before finishing and ensure no errors or warnings are reported.
- Report any follow-up items or potential improvements as comments in the PR, not as additional code changes.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
