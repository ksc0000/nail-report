# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by targeting core Firebase helper functions.

## Objective

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/` (creation of `src/__tests__/firestore.test.ts` and related files)
- `vite.config.ts` (only if Vitest configuration specifically for this task is missing and essential)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add a new test file: `src/__tests__/firestore.test.ts`.
- Write unit tests that cover all exported functions in `src/lib/firestore.ts`.
- Use `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`) to ensure tests are isolated and run quickly without actual Firebase calls.
- Assert that functions handle both success and error cases appropriately.
- Keep diff ≤ 150 lines. Focus on essential tests and follow good testing practices.
- Run `npm run test` to ensure new tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
