# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically targets enhancing test coverage for core Firebase operations.

## Objective

Add a new test file `src/__tests__/firestore.test.ts` and implement unit tests for at least two helper functions within `src/lib/firestore.ts` (e.g., functions for adding and fetching nail items). Ensure Firebase SDK functions are appropriately mocked using `vi.mock` to isolate the logic being tested.

## Allowed Scope

- `src/lib/firestore.ts` (Minor modifications if needed for testability, but the primary focus is on `src/__tests__/`)
- `src/__tests__/firestore.test.ts` (New file)
- `vite.config.ts` (If Vitest configuration for mocking is missing or incomplete, though Vitest is expected to be set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly mentioned in 'Allowed Scope'

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions in `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Tests should cover typical success cases and basic error handling scenarios.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
