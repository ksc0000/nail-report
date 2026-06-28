# Worker Prompt Template

## Context

The product roadmap focuses on improving stability, test coverage, and UX in Phase 2. This task is the first substantive step towards enhancing test coverage by introducing unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer not to alter core logic)
- `src/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (if minor configuration is required for mocking, unlikely but allowed)

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
- Write unit tests for at least two key functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, or `updateNailItem`.
- Use `vitest` and mock Firebase SDK dependencies as necessary to ensure tests are isolated and do not interact with actual Firebase services.
- Ensure test coverage for the selected functions.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
