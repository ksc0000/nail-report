# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests to a core utility file.

## Objective

Implement unit tests for helper functions within `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK dependencies to test the business logic of at least one significant helper function.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if necessary)
- `src/__tests__/firestore.test.ts` (new test file)

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

## Worker prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  Create a new test file: `src/__tests__/firestore.test.ts`.
2.  Set up Vitest to mock Firebase SDK dependencies (specifically Firestore methods) as needed for testing. Refer to existing test setups for mocking patterns if available, or establish a simple mock for `getFirestore()`, `collection()`, `doc()`, `getDocs()`, `addDoc()`, etc., that allows testing the logic within `firestore.ts` without actual Firebase calls.
3.  Write at least one test suite for a helper function within `src/lib/firestore.ts`, such as `addNailItem` or `getNailItems`, ensuring it covers basic success cases and demonstrates proper interaction with the mocked Firestore.
4.  Ensure the tests are passing.

**Acceptance Criteria:**

- A new file `src/__tests__/firestore.test.ts` exists.
- This file contains at least one passing test suite for a function from `src/lib/firestore.ts`.
- The tests correctly mock Firebase Firestore SDK interactions.
- `npm test` runs successfully, and `npm run build && npm run lint` completes without errors.

**Required Test Commands:**

```bash
npm test
npm run build && npm run lint
```
