```markdown
# Worker Prompt Template

## Context

The current roadmap focuses on Phase 2: improving stability, test coverage, and UX. This task will initiate the test coverage improvements by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the helper functions defined in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications to enable testing if necessary, e.g., exporting functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if Vitest setup/configuration is strictly necessary, which is unlikely for a new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests covering the main helper functions in `src/lib/firestore.ts` (e.g., functions for CRUD operations on `nailItems` or `publicShares`).
- Use Vitest for mocking Firebase SDK dependencies as needed.
- Ensure the tests can run successfully with `npm test`.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
