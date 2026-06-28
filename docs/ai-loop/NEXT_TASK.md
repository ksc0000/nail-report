# Worker Prompt Template

## Context

The `nail-report` application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task is the first substantive coding task for Jules, focusing on improving test coverage. Vitest is already configured and available for use. The goal is to start adding unit tests for core helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This task aims to verify the correct interaction of these helpers with the Firebase Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (or similar new test file in `src/__tests__/`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint && npm run test` before finishing.
- Create a new test file dedicated to `firestore.ts` in the `src/__tests__/lib/` directory.
- Use Vitest's `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`) to isolate the `firestore.ts` functions from actual Firebase calls during tests.
- Write tests to ensure each exportable helper function in `src/lib/firestore.ts` correctly calls its corresponding mocked Firebase Firestore methods with the expected arguments.
- Focus on verifying the "happy path" for CRUD operations (e.g., adding, getting, updating, deleting nail items).

## Worker prompt

Your task is to implement unit tests for the functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: In `src/__tests__/lib/`, create a new file named `firestore.test.ts`.
2.  **Mock Firebase Firestore**: Use `vi.mock('firebase/firestore')` at the top of your test file to mock the Firebase Firestore SDK. You will need to export mock implementations for functions like `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, and `deleteDoc` as needed to test the functions in `src/lib/firestore.ts`.
3.  **Test `firestore.ts` functions**: For each exportable function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem` if they exist), write a unit test.
    *   **Verify calls**: Assert that your `firestore.ts` function calls the mocked Firebase Firestore methods with the correct arguments.
    *   **Simulate responses**: Provide mock return values from your mocked Firebase functions to test how `firestore.ts` handles successful responses.
    *   **Coverage**: Aim to cover the primary logic paths for each helper function.

**Example of mocking `firebase/firestore`:**

```typescript
// src/__tests__/lib/firestore.test.ts
import { vi } from 'vitest';

const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockGetDocs = vi.fn(() => Promise.resolve({
  empty: false,
  docs: [
    { id: '1', data: () => ({ /* ... */ }) },
    { id: '2', data: () => ({ /* ... */ }) },
  ]
}));
const mockDoc = vi.fn();
const mockCollection = vi.fn();

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    collection: mockCollection,
    doc: mockDoc,
    addDoc: mockAddDoc,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    getDocs: mockGetDocs,
    // Add other Firestore functions you need to mock here
  };
});

// Now, in your tests, you can assert on mockAddDoc.mock.calls, etc.
```
