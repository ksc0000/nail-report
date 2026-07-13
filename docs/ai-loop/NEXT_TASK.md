# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on stability, test coverage, and UX improvements. This task specifically targets "2.1 Test coverage" by beginning to add unit tests for Firebase helper functions.

## Objective

Add Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are permissible)
- `src/__tests__/firestore.test.ts` (new file)
- `package.json` (only to update `test` script or add `vitest` config if strictly necessary, but preferably avoid adding new dependencies)
- `vite.config.ts` (minor configuration for Vitest if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory other than configuration files mentioned in "Allowed Scope"

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two core helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`).
- Ensure Firebase SDK calls are properly mocked using `vitest` and `vi.mock`. Do not make actual Firebase calls during tests.
- Verify that the tests cover basic success cases.
- Keep the overall diff size (including new files) ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Report any follow-up items (e.g., "remaining `firestore.ts` functions to test") as comments within the PR description, not as additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
