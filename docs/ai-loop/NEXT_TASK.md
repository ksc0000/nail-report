```markdown
# Worker Prompt Template

## Context

The project is currently in Phase 2, focusing on improving stability, test coverage, and UX. This task will initiate the test coverage improvements by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the `addNailItem` and `updateNailItem` functions within `src/lib/firestore.ts` using Vitest. This involves mocking the Firebase SDK to ensure tests are isolated and run efficiently without actual Firebase calls.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments needed for testability, if any)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/setup.ts` (if global setup for Firebase mocking is beneficial and small)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for at least `addNailItem` and `updateNailItem` functions in `src/lib/firestore.ts`.
- Use Vitest and mock the Firebase SDK (Firestore specifically) to prevent actual database interactions.
- Ensure the mock implementation provides predictable return values for test assertions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` and ensure new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
