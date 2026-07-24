# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for a core utility file.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on testing the primary CRUD operations (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`) and other utility functions in that file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/` (minor refactoring if necessary to make functions testable without breaking existing functionality)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Modifying UI components or CSS.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Use Vitest for tests.
- Mock Firebase SDK calls as necessary to isolate the `firestore.ts` functions.
- Cover at least 2-3 key functions in `src/lib/firestore.ts` with basic unit tests (e.g., `createNailItem`, `getNailItems`).
- Ensure tests run without requiring a live Firebase project connection.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
