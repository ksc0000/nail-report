# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task directly addresses the "2.1 Test coverage" objective by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for selected helper functions within `src/lib/firestore.ts`. The goal is to mock Firebase SDK dependencies and verify the logic of at least two key functions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only to ensure `vitest` script is available, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories outside of `src/` and `src/__tests__/`

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two helper functions in `src/lib/firestore.ts`. Good candidates might include `addNailItem`, `getNailItems`, or `deleteNailItem`.
- Use Vitest (`vitest`) as the test runner.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to ensure tests are isolated and do not interact with actual Firebase services.
- Verify the correct behavior of the functions, including success paths and basic error handling if applicable to the mocked interactions.
- Keep the overall diff size to ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before considering the task complete.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
