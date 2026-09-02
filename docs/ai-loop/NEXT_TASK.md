# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. The immediate next step is to address test coverage for core utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on basic CRUD operations and data marshalling functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but prefer to test existing public functions)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `package.json` (only to add a `test` script if not already present, but do not add new dependencies)
- `vite.config.ts` (only to configure Vitest if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory other than `package.json` or `vite.config.ts` for Vitest setup.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary using `vi.mock` to ensure unit isolation.
- Write tests for at least two key helper functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, or `updateNailItem`.
- Ensure tests cover basic success cases and potential error paths if easily mockable.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
