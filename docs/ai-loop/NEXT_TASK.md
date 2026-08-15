```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key aspect of stability is ensuring core helper functions are well-tested.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, focusing on increasing test coverage for these critical utilities. Mock the Firebase SDK as necessary to isolate the functions under test.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactors for testability if strictly necessary, but prefer to keep changes here minimal)
- `src/__tests__/firestore.test.ts` (create this new file for the tests)
- `src/__tests__/*.test.ts` (any other new test files specifically related to `src/lib/firestore.ts` if deemed necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `vitest.config.ts` (assume Vitest is already configured; do not modify its configuration)

## Requirements

- Keep the diff for the entire PR ≤ 150 lines.
- All existing helper functions in `src/lib/firestore.ts` should have basic unit test coverage.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to ensure tests are isolated and do not hit actual Firebase services.
- Ensure `npm run build`, `npm run lint`, and `npm test` all pass successfully before finishing the task.
- Report any follow-up items (e.g., functions that couldn't be easily tested, or limitations of the current testing setup) as comments in the PR, not as additional code changes.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
