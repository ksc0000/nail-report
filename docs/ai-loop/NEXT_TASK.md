# Worker Prompt Template

## Context

The product roadmap for nail-report prioritizes improving stability and test coverage in Phase 2.1. This task focuses on adding unit tests for core Firestore helper functions.

## Objective

Implement unit tests for the `getNailItems` and `addNailItem` functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments to facilitate testing, such as exporting non-exported functions, but primary focus is on `src/__tests__`)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration needs minor, non-dependency-adding adjustments to support testing, but prefer not to touch)

## Forbidden Scope

- `src/main.tsx`
- `commands/`
- `firestore.rules`, `storage.rules`
- `package.json` deps (no new npm packages)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file `src/__tests__/firestore.test.ts`.
- Mock the Firebase Firestore SDK (specifically `firebase/firestore` and potentially `firebase/app`) using `vi.mock` to isolate the functions under test from actual Firebase calls.
- Write at least one test case for `getNailItems` to verify it correctly fetches, processes, and returns data (e.g., handles an empty collection or a collection with items).
- Write at least one test case for `addNailItem` to verify it correctly calls the underlying Firestore API with the provided data.
- Keep the overall diff for this task ≤ 150 lines.
- Ensure `npm run build && npm run lint` pass without errors.
- Ensure `npm run test` (or directly `vitest`) runs and passes all newly added tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
