# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core helper functions. `vitest` is expected to be configured and available as a dev dependency.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (for potential minor adjustments to aid testing, e.g., exporting functions)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if necessary for Vitest configuration, but prefer to assume it's set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key helper functions in `src/lib/firestore.ts` (e.g., functions for adding, updating, or fetching nail items).
- Use Vitest and mock Firebase SDK dependencies as needed.
- Ensure the tests can run independently and do not interact with actual Firebase services.
- Run `npm run test`, `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
