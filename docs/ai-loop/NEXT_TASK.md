```markdown
# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The current state shows that initial AI Loop setup is complete, and we're ready for the first substantive coding task. The task should be small, bounded, and align with Phase 2 objectives.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering the main CRUD operations (add, get, update, delete) and any utility functions present.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer to only add tests)
- `src/__tests__/firestore.test.ts` (or similar new test file in `src/__tests__/`)
- `vitest.config.ts` (minor changes if needed for mocks, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other files outside the explicit 'Allowed Scope'

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock` to ensure tests are isolated and run quickly without actual Firebase calls.
- Cover at least the `addNailItem`, `getNailItem`, `updateNailItem`, and `deleteNailItem` (or similar CRUD-related) functions in `src/lib/firestore.ts`.
- Ensure tests are clean, readable, and follow existing testing patterns if any are present.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
