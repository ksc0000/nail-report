# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on covering basic CRUD operations or data transformation logic present in the file.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new test file)
- `vite.config.ts` (minor configuration for Vitest if absolutely necessary, e.g., aliases)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Use `vitest` for writing tests.
- Mock Firebase SDK dependencies as needed using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Focus on testing at least two key functions in `src/lib/firestore.ts`, such as functions related to adding, getting, updating, or deleting `nailItems`.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
