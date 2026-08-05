# Worker Prompt Template

## Context

The current phase is "2.1 Test coverage". The objective is to improve test coverage for core utility functions. This task focuses on adding unit tests for Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but primarily for understanding what to test)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `src/__tests__/utils.ts` (new file for shared test utilities if needed, e.g., mock setup)
- `vitest.config.ts` (minor modifications to include test files, if not already configured)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside `src/` except `vitest.config.ts`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, `src/__tests__/lib/firestore.test.ts`.
- Focus on testing the functions exported from `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, etc.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Ensure the tests are isolated and do not interact with actual Firebase services.
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
