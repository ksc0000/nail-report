# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firebase Firestore helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
-   `src/__tests__/lib/firestore.test.ts` (new file for tests)
-   `vitest.config.ts` (if minor configuration is needed for mocking, but prefer to assume existing setup)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css`

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add at least unit tests for 2-3 key helper functions in `src/lib/firestore.ts` (e.g., `addItem`, `updateItem`, `deleteItem`, `getItem`, `listItems`).
-   Use Vitest for testing.
-   Implement mocking for Firebase SDK dependencies (Firestore instance, collection/document references, getDoc, setDoc, updateDoc, deleteDoc, etc.) using `vi.mock` as appropriate, to ensure true unit tests.
-   Tests should cover success scenarios for the chosen functions.
-   Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock` to mock the necessary Firebase Firestore SDK functions and objects (e.g., `getFirestore`, `collection`, `doc`, `getDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `orderBy`, etc.) to isolate `src/lib/firestore.ts` functions from actual Firebase interactions. Ensure that the mocks return predictable data or resolve/reject promises as needed for test cases.
3.  **Implement Tests**: Write unit tests for at least two to three helper functions within `src/lib/firestore.ts`. Focus on verifying their expected behavior when interacting with the mocked Firestore. Examples of functions to test include:
    *   `addItem` (e.g., verify it calls `setDoc` with correct data)
    *   `updateItem` (e.g., verify it calls `updateDoc` with correct data)
    *   `getItem` (e.g., verify it calls `getDoc` and transforms snapshot correctly)
    *   `listItems` (e.g., verify it calls `getDocs` and maps results correctly)
4.  **Run Tests**: Ensure the new tests pass. You may need to install `vitest` if it's not already installed (`npm install -D vitest @vitest/coverage-v8`). The roadmap indicates Vitest is the chosen runner, implying setup is mostly complete.

This task is tightly scoped to adding tests for existing `firestore.ts` helpers, ensuring the diff remains small.

### Acceptance Criteria:

-   A new file `src/__tests__/lib/firestore.test.ts` exists.
-   This file contains `describe` and `it` blocks for at least 2-3 functions from `src/lib/firestore.ts`.
-   Firebase Firestore SDK dependencies are mocked using `vi.mock` or similar Vitest mechanisms.
-   The tests verify the correct interaction of the helper functions with the mocked Firestore (e.g., that `setDoc`, `getDoc`, `updateDoc` were called with the expected arguments).
-   `npm test` (or `vitest`) runs successfully, and the new tests pass.

### Required test commands:

```bash
npm install # Ensure all dependencies are in place, including vitest
npm run build
npm run lint
npm test # To run the Vitest tests
```
