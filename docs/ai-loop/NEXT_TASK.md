```markdown
# Worker Prompt Template

## Context

The `nail-report` application requires improved test coverage as part of Phase 2 of the product roadmap. The initial focus is on the core utility functions that interact with Firebase Firestore.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. This task will establish the testing framework for Firestore-related utilities, ensuring stability and correctness.

## Allowed Scope

- `src/lib/firestore.ts` (only to export functions if needed for testing, or minor refactors to improve testability, but the primary change is adding tests)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minor additions for Vitest configuration if strictly necessary, but prefer to use existing config if possible)
- `package.json` (only to add `vitest` as a dev dependency if not already present, and add test scripts if not already present; *do not add new application dependencies*)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new *runtime* npm packages without human approval; dev dependencies like `vitest` are allowed if not present)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines. Focus on 1-2 key functions in `src/lib/firestore.ts` to keep the PR small. Examples include `getNailItems`, `addNailItem`, or `updateNailItem`.
- Use Vitest as the test runner.
- Mock Firebase SDK dependencies (specifically Firestore) using `vi.mock` to ensure tests are isolated and fast.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Ensure tests cover basic success and error cases for the chosen functions.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
