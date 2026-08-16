# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. A key objective for this phase is to add unit tests, starting with helper functions that interact with Firebase. This task specifically targets `src/lib/firestore.ts`.

## Objective

Implement unit tests for selected helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for minor modifications if needed to make functions testable, e.g., exporting)
- `src/__tests__/` (for creating new test files like `src/__tests__/firestore.test.ts`)
- `vite.config.ts` (for Vitest configuration if necessary, though Vitest should already be set up)

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

## Worker Prompt

The current task is to enhance test coverage for the `nail-report` application. Your specific objective is to write unit tests for the helper functions located in `src/lib/firestore.ts`.

**Steps:**

1.  **Create a New Test File:** Create a new file named `src/__tests__/firestore.test.ts`.
2.  **Identify Key Functions:** Review `src/lib/firestore.ts` and identify at least two core functions that interact with Firestore (e.g., `addNailItem`, `getNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `addPublicShare`, `getPublicShare`).
3.  **Implement Mocking:** Set up `vi.mock` to mock the Firebase Firestore SDK functions (`getFirestore`, `doc`, `collection`, `addDoc`, `getDoc`, `updateDoc`, `deleteDoc`, `query`, `getDocs`, `where`) to prevent actual calls to Firebase during testing. Ensure tests are isolated and run quickly.
4.  **Write Unit Tests:** For the identified functions, write unit tests that cover:
    *   Successful execution paths (e.g., item added, item retrieved successfully).
    *   Basic error handling (e.g., what happens if a Firestore operation fails, if applicable).
5.  **Test for Isolation:** Verify that the tests do not make actual network requests to Firebase.

**Acceptance Criteria:**

*   A new test file `src/__tests__/firestore.test.ts` is created.
*   At least two functions from `src/lib/firestore.ts` have corresponding unit tests.
*   The Firebase Firestore SDK is effectively mocked using `vi.mock` in `src/__tests__/firestore.test.ts`.
*   All tests pass when running `npm run test`.
*   `npm run build` and `npm run lint` execute successfully without errors or warnings.

**Required Test Commands:**

```bash
npm install # Ensure all dependencies are up to date
npm run test # Run the newly added unit tests
npm run build # Verify the application builds correctly
npm run lint # Ensure code style and quality standards are met
```
