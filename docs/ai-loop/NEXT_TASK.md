```markdown
# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task. The current phase is 2.0, focusing on stability, test coverage, and UX improvements. This task specifically addresses test coverage by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only for testability, if strictly necessary, but prefer not to)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding a test script entry if not already present, but *not* for new `dependencies` or `devDependencies`)
- `vite.config.ts` (if Vitest configuration is needed for the new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx`, `src/App.css`, `src/lib/storage.ts`, `src/lib/auth.ts`, `src/lib/publicShares.ts`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions within `src/lib/firestore.ts`. Focus on functions that interact with Firestore by mocking the Firebase SDK.
- Use `vitest` for the tests. Assume `vitest` is already set up as a dev dependency.
- Mock Firebase SDK dependencies as needed to ensure tests are isolated unit tests.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
