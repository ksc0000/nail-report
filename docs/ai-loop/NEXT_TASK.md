# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task will contribute to the test coverage goal by adding unit tests for existing Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on basic CRUD operations and error handling paths.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal or none)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minimal configuration for Vitest if absolutely necessary, but assume Vitest is largely set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other files outside the allowed scope.

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed to isolate `firestore.ts` functions.
- Write unit tests for at least two functions in `src/lib/firestore.ts` (e.g., `addItem`, `getItem`, `updateItem`, `deleteItem`, `getItems`). Include tests for successful execution and at least one error path (e.g., a Firestore operation failing).
- Ensure test coverage is added for the selected functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
