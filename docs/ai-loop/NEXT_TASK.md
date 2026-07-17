```markdown
# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. The current state indicates that test coverage is a priority for Phase 2.1, and Vitest is the chosen test runner. No substantive development tasks have been completed yet. This task initiates the test coverage efforts by focusing on core Firestore helper functions.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to improve testability, if strictly necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (for necessary Vitest configuration, e.g., setting up mocks)
- `package.json` (for adding `npm test` script if not present, but **no new dependencies**)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files or directories not explicitly listed in "Allowed Scope".

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock the Firebase SDK (specifically Firestore) appropriately within the tests to ensure isolation.
- For `addNailItem`:
    - Add at least one unit test case for successful item creation.
    - Add at least one unit test case for error handling (e.g., simulating a Firestore write failure).
- For `getNailItems`:
    - Add at least one unit test case for successful retrieval of an empty list.
    - Add at least one unit test case for successful retrieval of a list with items.
    - Add at least one unit test case for error handling (e.g., simulating a Firestore read failure).
- Ensure the tests are independent and do not rely on actual Firebase interaction.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` (or equivalent Vitest command) to ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
