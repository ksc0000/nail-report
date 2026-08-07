# Worker Prompt Template

## Context

The current phase is 2.0, focusing on stability, test coverage, and UX improvements. This task targets `Phase 2.1 Test coverage` by adding unit tests for core Firebase Firestore helper functions. Vitest is the designated test runner.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on the CRUD operations for nail items. This will involve mocking the Firebase SDK to isolate the logic being tested.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but focus is on testing existing logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions for Vitest setup if strictly necessary, but prefer to assume Vitest is already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be an existing dev dependency based on the roadmap)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other CSS files

## Requirements

- Add a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least `addNailItem`, `updateNailItem`, and `deleteNailItem` functions in `src/lib/firestore.ts`.
- Use `vi.mock('firebase/firestore')` and `vi.mock('firebase/auth')` as needed to mock Firebase SDK calls.
- Assert that the functions call the correct Firebase Firestore methods with the expected arguments.
- Keep the total diff for the PR to ≤ 150 lines.
- Ensure `npm run build && npm run lint` passes before considering the task complete.
- Run `npm test` to verify the new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
