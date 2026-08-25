# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. The first priority within this phase is to enhance test coverage (2.1), specifically by adding unit tests for key helper functions. Vitest has been selected as the test runner, and Firebase SDK mocking is expected.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest, ensuring that the Firebase SDK is properly mocked.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are permissible, but the primary goal is testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if minor configuration is needed for test setup, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be installed)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly listed in "Allowed Scope"

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least the primary CRUD helper functions (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShareItem`, `setPublicShareItem`) within `src/lib/firestore.ts`.
- Ensure that Firebase SDK methods are mocked correctly using `vitest` to isolate the unit tests from actual Firebase calls.
- Run `npm run build && npm run lint` before finishing.
- Verify that tests pass by running `npm test` (or the equivalent Vitest command configured for the project).
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
