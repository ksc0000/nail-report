# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK as necessary.

## Allowed Scope

- `src/lib/firestore.ts`
- `src/__tests__/firestore.test.ts` (new file)
- `vitest.config.ts` (minor configuration if required for mocks)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials
- `src/App.tsx` or any other UI component files (unless absolutely necessary for testing `firestore.ts` functions directly, which is unlikely)

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for the primary helper functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, and `deleteNailItem` (or similar CRUD operations if names differ).
- Effectively mock the Firebase Firestore SDK using `vi.mock` to ensure tests run in isolation without connecting to actual Firebase services.
- Ensure the tests provide good coverage for the logic within the `firestore.ts` helpers.
- Keep the total diff size for this PR under 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` to verify tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
