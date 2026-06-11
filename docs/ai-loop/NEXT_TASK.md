```markdown
# Worker Prompt Template

## Context

The product roadmap indicates that Phase 2.1 is focused on improving test coverage. The current state shows that Vitest has been chosen as the test runner and the first step is to add unit tests for `src/lib/firestore.ts` helper functions. An existing task (#139) is addressing loading skeleton accessibility, so we should avoid that area for this task.

## Objective

Implement unit tests for one or two core helper functions within `src/lib/firestore.ts` using Vitest. Focus on `createNailItem` and/or `getNailItems` to keep the scope small.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if necessary for testability, but primarily adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, aim to avoid)

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
- Mock Firebase SDK dependencies as needed for isolated unit testing.
- Write tests for at least one of the following functions: `createNailItem` or `getNailItems` (or both if the diff remains small).
- Ensure tests cover successful execution paths and basic error handling.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
