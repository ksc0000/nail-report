# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task will begin addressing test coverage by adding unit tests for existing Firestore helper functions. Vitest is the designated test runner for this project.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts`, mocking Firebase SDK interactions where necessary to ensure focused unit testing.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to add `export` where needed for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for mocking, keep minimal)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two key helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `addTag`, etc.).
- Ensure Firebase SDK calls are mocked using `vi.mock` to isolate the functions under test from actual Firebase interactions.
- Test both successful execution and potential error cases for the chosen functions.
- Keep diff ≤ 150 lines.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
