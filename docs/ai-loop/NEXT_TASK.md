# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. A key item for Phase 2.1 is adding unit tests for Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions exported from `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported helpers)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only if adding a test script, no new dependencies)
- `vite.config.ts` (if Vitest configuration is needed, which it shouldn't be for this basic task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for all exported helper functions within `src/lib/firestore.ts` (e.g., `getNailItem`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc.).
- Mock Firebase SDK dependencies as needed using `vitest` and `vi.mock`.
- Ensure tests provide reasonable coverage for the happy path and basic error scenarios.
- Run `npm run test` and ensure all new tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
