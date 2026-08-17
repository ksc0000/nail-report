# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current task is to begin implementing unit tests for the core helper functions.

## Objective

Add Vitest unit tests for the functions defined in `src/lib/firestore.ts`. This involves setting up mocks for Firebase Firestore SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed for testability, e.g., exporting)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup for mocks is needed, though likely already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`).
- Use `vi.mock` to mock Firebase Firestore SDK interactions.
- Tests should cover typical success cases.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
