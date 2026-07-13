```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX improvements. This task specifically addresses `2.1 Test coverage`. Vitest is already established as the test runner for the project.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if necessary for testing)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts`. Examples include functions for adding, updating, or deleting nail items or public shares.
- Mock Firebase SDK dependencies as necessary using `vi.mock` to isolate the functions under test from actual Firebase calls.
- Ensure the tests cover basic functionality and edge cases where applicable (e.g., empty data, successful operations).
- Keep the overall diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
