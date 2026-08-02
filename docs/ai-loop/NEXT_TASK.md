# Worker Prompt Template

## Context

The product roadmap is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to existing helper functions should only be to make them testable, e.g., exporting a non-exported helper; no changes to core logic or bug fixes)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if absolutely necessary for test setup, but prefer existing configuration)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any UI-related CSS files
- `src/App.tsx` or other UI components (unless it's to export a prop for testing, which is unlikely for `firestore.ts`)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Ensure Firebase SDK calls within `src/lib/firestore.ts` are appropriately mocked using `vi.mock` to allow for isolated unit testing without actual Firebase calls.
- Cover successful data operations (add, get, update, delete) and relevant error handling paths for the functions in `src/lib/firestore.ts`.
- Focus on testing the logic and data transformations performed by the helper functions, not the Firebase service itself.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

You are tasked with writing unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Identify Testable Functions**: Review `src/lib/firestore.ts` and identify the key functions responsible for interacting with Firestore (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or similar named functions).
2.  **Create Test File**: Create a new file named `src/__tests__/firestore.test.ts`.
3.  **Implement Mocking**:
    *   Set up `vi.mock` to mock the Firebase Firestore SDK. You will likely need to mock `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, and any other Firestore methods used directly within `src/lib/firestore.ts`.
    *   Ensure your mocks return expected values for successful operations and throw errors for failure scenarios to test error handling.
    *   Refer to the existing `vitest` setup if any (e.g., for `auth.ts` or `storage.ts` if tests exist, or general patterns in the `vitest` documentation for Firebase mocking).
4.  **Write Unit Tests**: For each identified function in `src/lib/firestore.ts`:
    *   Write test cases that cover:
        *   Successful execution (e.g., adding an item, retrieving a list, updating an item).
        *   Correct data transformation or processing by the helper functions.
        *   Error handling (if the function explicitly handles errors from Firestore, test these paths).
    *   Use `vitest` assertions (`expect`).
5.  **Avoid Real Firebase Calls**: All tests should run purely in memory using your mocks, without connecting to a real Firebase project.
6.  **Maintain Code Quality**: Ensure tests are clear, concise, and follow best practices.
7.  **Run Checks**: Before completing the task, run `npm run build` and `npm run lint` and ensure no errors or warnings are reported. Also, run your new tests to confirm they pass.
