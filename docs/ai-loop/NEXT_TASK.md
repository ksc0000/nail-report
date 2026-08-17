# Worker Prompt Template

## Context

The product roadmap outlines a focus on improving stability, test coverage, and UX in Phase 2. This task specifically addresses the "2.1 Test coverage" goal, laying a foundation for more robust development. The current state shows that this is the first substantive task in Phase 2.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability are allowed if absolutely necessary, but prefer not to change core logic)
- `src/__tests__/` (new test files for firestore helpers)
- `vitest.config.ts` (if minor configuration is needed for mocking, but avoid major changes or new deps)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other UI-related CSS

## Requirements

- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Identify and write unit tests for key helper functions within `src/lib/firestore.ts` that interact with Firestore (e.g., functions for adding, updating, deleting, or fetching data like `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItemsForUser` etc.).
- Utilize Vitest for running tests.
- Mock Firebase SDK dependencies using `vi.mock` to isolate the `firestore.ts` functions and prevent actual database calls.
- Ensure tests cover typical success cases and relevant error handling paths for at least 2-3 significant functions.
- Keep the overall diff for the PR to ≤ 150 lines.
- Run `npm test`, `npm run build`, and `npm run lint` before finishing to ensure code quality and no build errors.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Acceptance Criteria

1.  A new file `src/__tests__/firestore.test.ts` (or similar name) exists and contains unit tests.
2.  At least two helper functions from `src/lib/firestore.ts` have comprehensive unit tests.
3.  Firebase SDK interactions are mocked using `vi.mock`.
4.  All tests pass when `npm test` is run.
5.  `npm run build` completes successfully.
6.  `npm run lint` reports no errors.

### Required Test Commands

```bash
npm test
npm run build
npm run lint
```
