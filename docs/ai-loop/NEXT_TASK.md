# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. The current objective is to enhance test coverage for core utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testing, e.g., exporting unexported functions, but prefer not to)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (only if absolutely necessary for Vitest configuration, but assume Vitest is already set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css`

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two significant helper functions within `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, or `deleteNailItem`.
- Mock Firebase SDK dependencies as needed to ensure isolated unit tests.
- Ensure tests run successfully with `npm test`.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Worker prompt

Jules, your task is to add unit tests for the `src/lib/firestore.ts` helper functions.

1.  Create a new test file at `src/__tests__/firestore.test.ts`.
2.  Inside this file, write unit tests for at least two helper functions from `src/lib/firestore.ts`. Examples include `addNailItem`, `updateNailItem`, or `deleteNailItem`.
3.  Use Vitest for writing these tests. Assume Vitest is already configured in the project.
4.  Mock any Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`) to ensure that the tests are unit tests and do not interact with a live Firestore database.
5.  Ensure that the added tests pass when running `npm test`.
6.  Do not modify `src/lib/firestore.ts` unless absolutely necessary to export a function for testing that was not previously exported. Prioritize testing existing public interfaces.
7.  Verify the project still builds and passes linting by running `npm run build && npm run lint`.
