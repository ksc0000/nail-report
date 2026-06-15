```markdown
# Worker Prompt Template

## Context

The nail-report application is currently in Phase 2 of its roadmap, which focuses on improving stability, test coverage, and user experience. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests to critical helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. The tests should mock Firebase SDK dependencies to ensure isolated unit testing.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer to test existing exports)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (any new necessary mock files)
- `vitest.config.ts` (if minor adjustments are needed for test setup, but prefer to avoid if possible)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`. Focus on functions that interact with Firestore.
- Ensure Firebase SDK calls are mocked to prevent actual database interactions during tests.
- Keep the overall diff for this PR below 150 lines.
- Run `npm test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing to ensure code quality and build integrity.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
