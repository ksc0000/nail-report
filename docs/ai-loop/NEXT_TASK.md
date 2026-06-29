```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement unit tests for helper functions in `src/lib/firestore.ts` using Vitest, focusing on core CRUD operations. This task directly addresses Phase 2.1 Test coverage from the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (for testing purposes; minor refactoring for testability is permitted if strictly necessary and within diff limits, but the primary goal is to *test* its existing functionality)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (to ensure Vitest is correctly configured, if necessary)
- `package.json` (to ensure the `test` script runs Vitest, if necessary, but *no new npm dependencies*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least the `addItem` and `updateItem` functions within `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure all tests pass when running `npm run test`.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
