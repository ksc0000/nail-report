# Worker Prompt Template

## Context

The product is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. Specifically, focus on `addItem` and `deleteItem` functions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter application logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is not complete, minor additions for test environment config, but no new npm deps)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest should be configured already or added via existing dev deps)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any files or directories not explicitly listed in 'Allowed Scope'

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` to house the new tests.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Write unit tests for the `addItem` and `deleteItem` functions in `src/lib/firestore.ts`.
- Ensure tests cover basic success cases and error handling (if error handling is present in these specific helpers).
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` to confirm tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
