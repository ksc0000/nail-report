# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that Vitest is the designated test runner for unit tests. This task will initiate the test coverage efforts by targeting core Firestore helper functions.

## Objective

Implement unit tests for a subset of helper functions within `src/lib/firestore.ts` using Vitest. This task focuses specifically on `addNailItem` and `getNailItems` to ensure their basic functionality and interaction with the mocked Firebase SDK.

## Allowed Scope

- `src/` (except `src/main.tsx`)
- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a new test file)
- `src/__tests__/firestore.test.ts` (new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for the `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
- Mock the Firebase SDK (Firestore, Auth, etc.) as necessary using `vi.mock` to ensure tests are isolated and don't interact with actual Firebase services.
- Ensure tests cover basic success cases for both functions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` (or `npx vitest`) and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
