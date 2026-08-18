# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the first item under '2.1 Test coverage' by adding unit tests for a core Firebase helper file.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `package.json` (only for adding a Vitest run script if not already present, no new dependencies)
- `vite.config.ts` (if Vitest configuration is needed, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant for this task)
- Any other files not explicitly allowed

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItemsForUser`).
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Ensure the tests run successfully with Vitest.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
