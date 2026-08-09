```markdown
# Worker Prompt Template

## Context

The application is currently in Phase 2, which focuses on improving stability, test coverage, and UX. This task is the first step in addressing the test coverage objective. The goal is to establish a testing foundation for the core Firebase helper functions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`. This involves creating a new test file, configuring Vitest (if necessary), and effectively mocking Firebase SDK dependencies to ensure isolated unit tests.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring to enable testability is acceptable if necessary)
- `src/__tests__/` (new test files, specifically `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (only for adding Vitest configuration if absolutely necessary, but prioritize using existing setup)
- `package.json` (only to add a `test` script if missing, no new npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep the overall diff for this task ≤ 150 lines.
- Create a new test file named `src/__tests__/firestore.test.ts`.
- Write unit tests for the key helper functions exported from `src/lib/firestore.ts`.
- Utilize `vitest` as the test runner.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure tests cover typical usage scenarios for the helper functions, including successful operations and basic error paths if directly handled by the helpers.
- Run `npm run build && npm run lint` successfully before marking the task complete.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
