# Worker Prompt Template

## Context

The current phase of the roadmap focuses on improving stability and test coverage. This task will initiate unit testing for our Firebase helper functions, starting with Firestore operations, which is crucial for ensuring data integrity and application reliability.

## Objective

Implement unit tests for the `addItem` and `getNailItems` functions in `src/lib/firestore.ts` using Vitest. This involves mocking the Firebase Firestore SDK methods to isolate the functions under test.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup needs adjustment for mocks)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file named `src/__tests__/firestore.test.ts`.
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase Firestore SDK functions (e.g., `doc`, `collection`, `addDoc`, `getDocs`, `query`, `where`, `orderBy`).
- Ensure the tests for `addItem` verify that `addDoc` is called with the correct arguments and handles success/failure scenarios.
- Ensure the tests for `getNailItems` verify that Firestore query methods are called correctly and that the function processes the snapshot data as expected.
- Keep the diff ≤ 150 lines. Focus on robust tests for these two functions rather than superficial tests for many functions.
- Run `npm run build && npm run lint` before finishing.
- Report any follow-up items (e.g., "more tests needed for other functions in `firestore.ts`") as comments within the PR description.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
