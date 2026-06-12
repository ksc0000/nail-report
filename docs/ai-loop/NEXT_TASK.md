# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state indicates we are in Phase 2.0. The first task should contribute to this phase.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. Focus on covering basic CRUD operations and data marshalling where applicable.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only if adding a `test` script or similar, but Vitest should already be configured)
- `vite.config.ts` (only for Vitest configuration, if necessary)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other CSS files

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` as needed.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover successful execution paths and basic error handling or edge cases relevant to the function's logic.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
