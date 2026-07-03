```markdown
# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task will initiate the test coverage sub-phase by adding unit tests for core Firebase Firestore helper functions. Vitest is already configured as the test runner.

## Objective

Add comprehensive unit tests for the helper functions within `src/lib/firestore.ts` using Vitest and Firebase SDK mocking.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/utils/` (new directory/files for test utilities, if necessary)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (no CSS changes for this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`) using `vi.mock` to isolate `firestore.ts` logic.
- Cover key functions in `src/lib/firestore.ts`, such as `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getPublicShare`, `addPublicShare`, `updatePublicShare`, and `deletePublicShare`.
- Ensure tests cover successful operations and handle potential error scenarios (e.g., Firebase errors).
- No new npm dependencies should be added.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

Jules, your task is to implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create Test File**: Create a new test file at `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` from Vitest to mock the Firebase Firestore SDK. You'll need to mock functions like `getFirestore`, `collection`, `doc`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, and `deleteDoc` to control their return values and simulate various scenarios without actual Firebase calls.
3.  **Implement Tests**: Write unit tests for the following functions in `src/lib/firestore.ts`:
    *   `getNailItems` (ensure it fetches and transforms data correctly)
    *   `addNailItem` (verify it calls `addDoc` with correct data)
    *   `updateNailItem` (verify it calls `updateDoc` with correct data and ID)
    *   `deleteNailItem` (verify it calls `deleteDoc` with correct ID)
    *   `getPublicShare` (ensure it fetches and transforms data correctly)
    *   `addPublicShare` (verify it calls `addDoc` with correct data)
    *   `updatePublicShare` (verify it calls `updateDoc` with correct data and ID)
    *   `deletePublicShare` (verify it calls `deleteDoc` with correct ID)
4.  **Cover Edge Cases**: Where applicable, include tests for error handling (e.g., what happens if a Firebase operation fails).
5.  **Run Checks**: Before completing, ensure your code passes `npm run build` and `npm run lint`.
```
