# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. The current focus is on test coverage, specifically adding unit tests to critical helper functions. Vitest is the chosen test runner.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This involves mocking Firebase SDK dependencies as necessary to ensure isolated unit tests.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if absolutely necessary for testability, e.g., exporting unexported helpers)
- `src/__tests__/` (new files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if Vitest or related test dependencies are *already present* but require minor config changes; no new `dependencies` or `devDependencies` are allowed without explicit approval.)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (addition of new `dependencies` or `devDependencies`)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` (except `package.json` for *minor* config review, not dependency addition)

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write comprehensive unit tests for the functions exported from `src/lib/firestore.ts`.
- Utilize Vitest's mocking capabilities (e.g., `vi.mock`) to mock Firebase SDK dependencies (Firestore, Auth, etc.) to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure test coverage for error paths and successful execution paths.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
