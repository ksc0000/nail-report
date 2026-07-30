# Worker Prompt Template

## Context

The current roadmap focuses on improving stability, test coverage, and UX in Phase 2. The first sub-phase, 2.1, is dedicated to increasing test coverage. This task will initiate the testing effort by focusing on a critical utility file.

## Objective

Add unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but primary focus is test file creation)
- `src/__tests__/firestore.test.ts` (new file)
- `src/__tests__/` (other new test files if necessary for setup, but prefer one main file)

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

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

### Worker Prompt

The `nail-report` application uses Firebase Firestore helper functions defined in `src/lib/firestore.ts` for data interaction. Your task is to establish initial unit test coverage for these functions using Vitest.

1.  **Create a new test file:** Add a new file at `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Utilize `vi.mock()` to mock Firebase Firestore and its methods (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to isolate the `firestore.ts` functions from actual Firebase calls during testing. Focus on mocking the return values and asserting that the correct Firebase methods are called with the expected arguments.
3.  **Write Unit Tests:** Implement unit tests for at least one significant helper function within `src/lib/firestore.ts`. Good candidates include `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`. The tests should cover successful operations and, if straightforward, basic error handling if relevant to the function's direct logic.

### Acceptance Criteria

- A new test file `src/__tests__/firestore.test.ts` is created.
- The Firebase Firestore SDK is appropriately mocked using Vitest's `vi.mock()`.
- At least one helper function from `src/lib/firestore.ts` has comprehensive unit tests covering its primary logic and interaction with the mocked Firebase SDK.
- Tests pass successfully.

---

## Summary of what changed

Added a new test file `src/__tests__/firestore.test.ts` to implement unit tests for helper functions in `src/lib/firestore.ts`. This involved mocking Firebase Firestore SDK methods to enable isolated testing of the application's data layer logic.

## Changed files list

- `src/__tests__/firestore.test.ts` (new file)
- Potentially minor, non-functional changes to `src/lib/firestore.ts` if needed for testability (e.g., exporting unexported helpers).

## Commands run and results

```bash
npm test # All tests in src/__tests__/firestore.test.ts should pass
npm run build # Should complete successfully
npm run lint # Should report no errors
```

## Known issues or limitations

- Comprehensive error path testing might be challenging with initial mocks and can be expanded in future tasks.
- Only one or a few key functions in `src/lib/firestore.ts` might be fully covered to stay within the diff limit.

## Suggested next task

Add Vitest + unit tests for `src/lib/storage.ts` helpers.
