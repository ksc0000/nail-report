```markdown
# Worker Prompt Template

## Context

The product roadmap for `nail-report` includes Phase 2.1, which focuses on improving test coverage. The current state indicates that no unit tests have been added for the `src/lib/` helper functions yet.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on a few key functions to keep the PR small and bounded.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally minimal changes to production code)
- `src/__tests__/` (new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (minimal modifications to configure Vitest if absolutely necessary, but assume Vitest is already set up to run tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or other UI-related files

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`. Examples include `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`. Prioritize simple CRUD operations that can be easily mocked.
- Use `vitest` for testing and mock Firebase SDK dependencies as needed.
- Ensure tests run successfully using `npm test`.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

```
