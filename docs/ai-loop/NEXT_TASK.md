# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage. This task focuses on `Phase 2.1 Test coverage`, specifically by introducing unit tests for Firebase helper functions. Establishing good testing practices for these core utilities is crucial for future development.

## Objective

Implement Vitest unit tests for the `addNailItem` function within `src/lib/firestore.ts`. The goal is to set up a basic testing pattern for Firebase Firestore helper functions, including mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (only to export functions if needed for testing, no logic changes)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if minor Vitest configuration for mocking is required)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to add unit tests for the `addNailItem` function located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Implement mocks**: Use `vi.mock` to mock the necessary Firebase Firestore SDK functions (`addDoc`, `collection`) that `addNailItem` depends on. Ensure that no actual calls to Firebase are made during the tests.
3.  **Write tests for `addNailItem`**:
    *   Test the successful creation of a nail item, verifying that `addDoc` is called with the correct arguments.
    *   Ensure the function correctly returns the expected data (e.g., the document ID if `addDoc` is mocked to return one).
4.  **Keep it minimal**: Focus on covering the primary success path for `addNailItem` to keep the PR small. Error handling can be addressed in subsequent tasks.

## Acceptance Criteria

- A new file `src/__tests__/lib/firestore.test.ts` is created.
- The `addNailItem` function from `src/lib/firestore.ts` has at least one successful unit test case.
- Firebase Firestore functions (`addDoc`, `collection`) are properly mocked using `vitest`'s mocking capabilities.
- `npm run test` executes successfully and shows the new test passing.

## Required Test Commands

```bash
npm install # Ensure all dependencies are up-to-date
npm run build
npm run lint
npm run test
```
