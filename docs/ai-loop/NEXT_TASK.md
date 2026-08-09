# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on stability, test coverage, and UX. This task contributes to improving test coverage for core utility functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on a few key functions to ensure a bounded task (e.g., `addNailItem`, `getNailItems`, `updateNailItem`).

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prioritize creating a new test file)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minimal changes for Vitest setup if absolutely necessary, but assume Vitest is largely configured)

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
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two functions in `src/lib/firestore.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Ensure tests are isolated and do not interact with actual Firebase services.
- Run `npm run test`, `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
