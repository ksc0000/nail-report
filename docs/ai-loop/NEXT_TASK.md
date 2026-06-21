# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that no substantive roadmap task has been completed yet, making this an ideal time to begin foundational improvements.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task specifically addresses the "2.1 Test coverage" goal of the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer to test existing exports)
- `src/__tests__/` (creation of new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor additions for setup if needed for Firebase mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/lib/firestore.ts` or `src/__tests__/`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions used by `src/lib/firestore.ts` to ensure tests are isolated and do not interact with actual Firebase services. Refer to existing Vitest configurations or examples if available for Firebase mocking.
- Write unit tests for at least two key functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, or `updateNailItem`.
- Ensure tests cover typical success cases and basic error handling scenarios.
- Run `npm run build && npm run lint && npm test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
