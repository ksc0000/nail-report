# Worker Prompt Template

## Context

Phase 2 of the roadmap is active, focusing on improving stability, test coverage, and user experience. This task contributes to increasing test coverage by adding unit tests for Firebase Firestore helper functions, specifically targeting `src/lib/firestore.ts`.

## Objective

Implement initial unit tests for `src/lib/firestore.ts` helper functions using Vitest, including the necessary setup for mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but prefer not to alter production code)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minimal configuration for Vitest if not already present, assuming `vitest` is already a `devDependency`)
- `package.json` (only to add or modify the `test` script if not already configured for Vitest; no new `dependencies` or `devDependencies` entries)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` (adding new `dependencies` or `devDependencies` entries)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Your task is to add Vitest unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Vitest Configuration**:
    *   Ensure that Vitest is correctly configured in `vite.config.ts` to run unit tests. This might involve adding a test block if it's not already present.
    *   Verify the `test` script in `package.json` is configured to run Vitest (e.g., `"test": "vitest"`). If not, update it. Do **not** add `vitest` as a new `devDependency` to `package.json`; assume it is already installed based on the roadmap.

2.  **Create Test File**:
    *   Create a new test file: `src/__tests__/firestore.test.ts`.

3.  **Mock Firebase SDK**:
    *   Inside `src/__tests__/firestore.test.ts`, implement mocking for the Firebase SDK modules (e.g., `firebase/firestore`) using `vi.mock`. This is crucial for isolating `firestore.ts` functions from actual Firebase interactions during tests.
    *   The mocks should simulate the expected behavior of Firestore functions like `getDocs`, `addDoc`, `updateDoc`, and `deleteDoc`.

4.  **Write Unit Tests**:
    *   Write unit tests for at least two core functions within `src/lib/firestore.ts`. Focus on `addNailItem` and `getNailItems` to cover both data creation and retrieval.
    *   For each function, include tests for:
        *   Successful execution with expected data.
        *   Error handling (e.g., when a Firestore operation fails).
    *   Ensure the tests assert the correct arguments are passed to the mocked Firebase functions and that the return values are handled as expected.

## Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- `src/__tests__/firestore.test.ts` contains `vi.mock` calls to correctly mock Firebase Firestore SDK.
- At least two functions from `src/lib/firestore.ts` (`addNailItem` and `getNailItems`) have basic unit tests covering success and error scenarios.
- All newly added tests pass when `npm run test` is executed.
- The PR diff is within the 150-line limit.

## Required Test Commands

```bash
npm run build && npm run lint && npm run test
```
