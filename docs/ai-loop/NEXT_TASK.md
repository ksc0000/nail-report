# Worker Prompt Template

## Context

The current phase (Phase 2.1) of the roadmap focuses on improving test coverage. `src/lib/firestore.ts` contains core helper functions for interacting with Firestore. Adding unit tests for these functions will increase stability and allow for safer refactoring.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK calls.

## Allowed Scope

- `src/lib/firestore.ts` (for inspection, minor refactors for testability if strictly necessary)
- `src/__tests__/lib/firestore.test.ts` (new test file)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `vite.config.ts` (Vitest should already be configured)

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for at least 2-3 significant helper functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`).
- Ensure Firebase SDK calls (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`) are properly mocked using `vitest.mock` or similar Vitest mechanisms to isolate the functions from actual database interactions.
- Test both successful execution paths and error handling paths (if applicable and simple to mock).
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Worker prompt

Here's a detailed plan for the task:

1.  **Create Test File**: Create a new file `src/__tests__/lib/firestore.test.ts`.
2.  **Import Functions**: Import the necessary helper functions from `src/lib/firestore.ts` into your new test file.
3.  **Mock Firebase SDK**:
    *   Implement mocks for the Firebase Firestore SDK using `vi.mock('firebase/firestore')`.
    *   You will need to mock functions like `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc` and any other Firestore-related functions used by the helpers you are testing.
    *   For example, `getFirestore` can return a mock Firestore instance, and `collection`, `doc`, etc., can return mock references with methods that simulate their behavior (e.g., `addDoc` returning a mock `DocumentReference`, `getDocs` returning a mock `QuerySnapshot`).
4.  **Write Unit Tests**:
    *   Choose 2-3 key functions from `src/lib/firestore.ts` for initial test coverage. Good candidates include `addNailItem`, `getNailItems`, and `updateNailItem`.
    *   For each selected function:
        *   Write `describe` blocks and `it` tests to cover its behavior.
        *   Test the successful execution path, asserting that the mocked Firebase functions are called with the correct arguments and that the helper function returns the expected result.
        *   Consider adding a basic test for an error scenario (e.g., if a mocked Firebase call throws an error).
5.  **Run Tests**: Execute `npm test` to verify your new tests pass.
6.  **Lint and Build**: Ensure the project still builds and passes linting checks with `npm run build && npm run lint`.

## Summary of what changed

Added a new test file `src/__tests__/lib/firestore.test.ts` containing unit tests for `addNailItem`, `getNailItems`, and `updateNailItem` helper functions from `src/lib/firestore.ts`. Firebase Firestore SDK calls were mocked to ensure isolated testing.

## Changed files list

- `src/__tests__/lib/firestore.test.ts` (new file)
- `src/lib/firestore.ts` (potentially minor modifications for testability, but primarily for reference)

## Commands run and results

```bash
npm test
# Expected: All tests pass for firestore.test.ts
npm run build
# Expected: Build completes successfully
npm run lint
# Expected: No linting errors
```

## Known issues or limitations

- The current task focuses on initial coverage for 2-3 functions; comprehensive testing of all `firestore.ts` helpers is a follow-up task.
- Complex Firebase queries or real-time listeners are not covered by these initial unit tests, as mocking their full behavior can increase complexity beyond the scope of this small PR.

## Suggested next task

Add Vitest + unit tests for `src/lib/storage.ts` helpers.
