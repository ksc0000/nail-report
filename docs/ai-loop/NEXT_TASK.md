# Worker Prompt Template

## Context

The current focus is on improving stability and test coverage for the `nail-report` application. The first step is to add unit tests for the core Firebase interactions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily for understanding)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__mocks__/firebase-firestore.ts` (new file for mocking Firebase SDK, if necessary)
- `vite.config.ts` (minor additions for Vitest setup if not already configured for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions in `src/lib/firestore.ts` (e.g., `createNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Use `vitest` and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to ensure tests are isolated and do not interact with a live Firebase project.
- Ensure the tests are clear, readable, and cover typical success and failure scenarios for the chosen functions.
- Keep the diff ≤ 150 lines. Focus on setting up the testing environment for this file and testing a couple of key functions thoroughly rather than trying to test everything in one PR.
- Run `npm run build && npm run lint` before finishing and ensure no errors.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
