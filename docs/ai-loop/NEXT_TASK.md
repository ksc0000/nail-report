# Worker Prompt Template

## Context

The current roadmap focuses on Phase 2, which includes improving stability, test coverage, and UX. This task will initiate the "Test coverage" aspect by adding unit tests for a core utility file.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`. This involves setting up a test file, mocking Firebase SDK calls, and writing tests for each relevant function.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, keep minimal)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `src/App.css` (no changes expected for this task)
- `vite.config.ts` (minor additions for Vitest setup if absolutely necessary, e.g., glob patterns, but prefer to assume Vitest is configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Use Vitest as the test runner.
- Mock Firebase SDK (Firestore, Auth, Storage) dependencies as needed for isolated unit testing.
- Write tests for functions that interact with Firestore (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc., or whatever relevant functions exist in `src/lib/firestore.ts`). Focus on testing the logic within these functions, not the Firebase SDK itself.
- Ensure the tests are run successfully.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
