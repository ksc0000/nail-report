# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring Firebase SDK interactions are properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally no functional changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (if Vitest setup is needed, but typically it's already there)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as necessary to isolate the functions under test.
- Write at least one unit test for each *exported* helper function in `src/lib/firestore.ts` that involves Firestore interactions (e.g., adding, getting, updating, deleting data).
- Ensure tests cover success and basic error scenarios where applicable without external network calls.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
