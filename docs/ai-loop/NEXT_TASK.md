# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task contributes to Phase 2.1 by adding foundational unit tests for core Firebase interactions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes if needed for testability, but focus on adding tests)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration is needed, but prefer to use existing setup)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts`, such as `addNailItem`, `getNailItems`, `updateNailItem`, or `deleteNailItem`.
- Mock Firebase Firestore SDK interactions using `vitest` and `vi.mock` to ensure tests are isolated and do not require actual Firebase connections.
- Ensure tests cover successful operations and basic error handling for the mocked Firestore calls.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker Prompt**

Hello Jules,

Your next task is to enhance the test coverage of the `nail-report` application by writing unit tests for the Firebase Firestore helper functions.

Specifically, you need to:

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Implement unit tests for at least two core functions found in `src/lib/firestore.ts`. Good candidates are `addNailItem` and `getNailItems`, but you can choose others if they are more straightforward to test first.
3.  When writing tests, ensure that all interactions with the Firebase Firestore SDK are properly mocked using `vitest`'s mocking capabilities (e.g., `vi.mock('firebase/firestore', ...)`). The tests should not make actual calls to Firebase.
4.  Verify both successful outcomes and basic error scenarios (e.g., a mocked Firestore operation rejects with an error).
5.  After completing the tests, run the following commands to ensure everything is in order: `npm run build`, `npm run lint`, and `npm run test`.
6.  Keep the changes concise, aiming for a diff of 150 lines or less. Focus on adding foundational tests, not exhaustive edge case coverage for this task.

This task is crucial for improving the stability and maintainability of the application's data layer. Good luck!
