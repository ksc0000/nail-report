```markdown
# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage improvements by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions defined in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/` (new test file for firestore helpers, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration, if necessary, but unlikely for basic setup)
- `package.json` (only to add a `test` script if not already present, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies (Firestore instances, document references, etc.) using `vitest` and `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Write tests that cover basic CRUD operations (add, get, update, delete) for nail items, as handled by the `firestore.ts` helper functions.
- Run `npm run build && npm run lint` before finishing.
- Ensure tests pass with `npm test` (or `vitest`).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Acceptance Criteria

- A new file `src/__tests__/firestore.test.ts` exists.
- This test file contains unit tests for relevant functions in `src/lib/firestore.ts`.
- Firebase SDK calls are properly mocked, ensuring tests are hermetic.
- All new tests pass successfully when `npm test` is executed.
- The `npm run build && npm run lint` commands pass without errors or warnings.
```
