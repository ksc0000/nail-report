# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" goal by adding unit tests for critical Firebase helper functions.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on basic CRUD operations for nail items.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if necessary)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only to update `test` script or add `vitest` config if not already present, but no new dependencies)
- `vite.config.ts` (for Vitest setup if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory, except for `package.json` and `vite.config.ts` for Vitest setup.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
- Mock Firebase SDK dependencies using `vi.mock` from Vitest to isolate the functions under test.
- Ensure tests cover successful execution paths.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
