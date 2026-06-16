# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability and test coverage. This task aims to kickstart the test coverage initiative by adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. Focus on covering the main CRUD (Create, Read, Update, Delete) operations for `nailItems`. The Firebase SDK should be mocked using `vi.mock`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability are allowed if absolutely necessary, but prioritize testing existing functionality)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock the Firebase SDK as necessary to test the helper functions in isolation, following the Vitest mocking pattern (e.g., `vi.mock('firebase/firestore', ...)`, `vi.mock('firebase/app', ...)`).
- Ensure tests cover at least the `addItem`, `updateItem`, `deleteItem`, and `getItemById` (or similar core CRUD) functions in `src/lib/firestore.ts`.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
