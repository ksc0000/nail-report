# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX. This task addresses the "Test coverage" objective by adding unit tests to critical helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on core CRUD operations.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testing, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/vitest.config.ts` (if minor configuration is needed for `vi.mock` setup, but prioritize using existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`
- Any files outside the `src/` directory other than those explicitly allowed

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Mock the Firebase SDK as necessary to test `src/lib/firestore.ts` functions in isolation.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests cover basic success cases for the chosen functions.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.
- Report follow-up items (e.g., more comprehensive error path tests) as comments in the PR description, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
