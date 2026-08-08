# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for a core utility file.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on basic CRUD operations and error handling in these functions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vitest.config.ts` (if absolutely necessary for basic setup, but prefer to assume it's ready)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least two functions from `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
- Use Vitest and mock Firebase SDK dependencies as needed.
- Ensure tests cover successful operations and basic error scenarios (e.g., Firestore rejection).
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
