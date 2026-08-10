# Worker Prompt Template

## Context

The application is in Phase 2 of the roadmap, focusing on improving stability, test coverage, and UX. The first concrete step in Phase 2.1 (Test coverage) is to add unit tests for existing helper functions. This task focuses on the `firestore.ts` helpers.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally not)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest setup is missing or incomplete for these tests, minor adjustments only)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for the functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, etc. (depending on what's available and testable).
- Use Vitest for testing. Assume Vitest is already configured in the project.
- Mock Firebase SDK dependencies as needed to enable isolated unit testing.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
