# Worker Prompt Template

## Context

The `nail-report` application requires improved test coverage as part of Phase 2.1 of the product roadmap. The `src/lib/firestore.ts` file contains core helper functions for interacting with Firebase Firestore. This task initiates the process of adding unit tests for these critical functions.

## Objective

Add unit tests for one or two simple helper functions within `src/lib/firestore.ts` using Vitest, focusing on setting up basic mocking for Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but prefer to assume it's set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Implement unit tests for at least one simple helper function in `src/lib/firestore.ts`, such as `getCollectionRef` or `getDocumentRef`.
- Use `vitest` for testing.
- Mock Firebase SDK dependencies (e.g., `firebase/firestore`) using `vi.mock` to isolate the functions under test.
- The tests should verify the correct behavior of the targeted Firestore helper functions.
- Ensure the diff for the entire PR is ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` and ensure all tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
