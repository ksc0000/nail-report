# Worker Prompt Template

## Context

The product roadmap outlines Phase 2: "Improve stability, test coverage, and UX". A key part of this is adding unit tests, starting with core Firebase helper functions.

## Objective

Add unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new test file)
- `src/__tests__/` (other new test utility files if absolutely necessary, but prefer existing mocks)
- `vitest.config.ts` (minor modifications for test setup if required, e.g., mock paths)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as necessary using `vi.mock` to ensure tests run in isolation without actual Firebase calls.
- Write unit tests for at least two key functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
- Ensure tests cover success cases and potential error handling where applicable.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
