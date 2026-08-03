# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firebase utility functions. Vitest is the designated test runner, and mocking the Firebase SDK is a key aspect of these tests.

## Objective

Implement comprehensive unit tests for the helper functions located in `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (to inspect existing functions and potentially add minor testability refactors if necessary)
- `src/__tests__/` (to create new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (for confirming Vitest scripts, but *not* for adding new dependencies)

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
- Add unit tests for all public helper functions within `src/lib/firestore.ts`.
- Tests must effectively mock the Firebase SDK (Firestore instances, document references, collection references, etc.) to ensure tests are isolated and do not interact with a live Firebase project.
- Use Vitest as the test runner.
- Ensure test coverage for the functions in `src/lib/firestore.ts` is improved.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Import Vitest utilities:** Utilize `vi.mock` to mock Firebase SDK modules (e.g., `firebase/firestore`).
3.  **Identify functions to test:** Go through `src/lib/firestore.ts` and identify all exportable helper functions (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc., if they exist there).
4.  **Write test suites:** For each function identified, write a `describe` block.
5.  **Implement test cases:** Inside each `describe` block, write multiple `it` blocks to cover different scenarios:
    *   Successful operations.
    *   Error handling (e.g., when Firestore operations fail).
    *   Correct data transformation/manipulation.
6.  **Mock Firebase:** Ensure that all interactions with Firebase Firestore are mocked. This involves:
    *   Mocking `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, etc.
    *   Mocking return values for these functions to simulate successful responses and errors.
    *   Using `vi.fn()` to track function calls and assert their arguments.
7.  **Run tests:** Execute `npm test` to verify your tests run correctly.
8.  **Lint and build:** Ensure the project lints and builds successfully (`npm run lint && npm run build`).

**Example mocking approach:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return a mock Firestore instance
    collection: vi.fn(() => ({ id: 'mockCollectionRef' })), // Mock collection to return a mock ref
    doc: vi.fn(() => ({ id: 'mockDocRef' })), // Mock doc to return a mock ref
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    // Add other Firestore functions as needed
  };
});

// Assuming a function like this exists in src/lib/firestore.ts
// export const addNailItem = async (userId: string, itemData: any) => { ... }

describe('addNailItem', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should successfully add a nail item', async () => {
    // Setup mock return values
    (addDoc as vi.Mock).mockResolvedValueOnce({ id: 'new-item-id' });

    // Call the function under test
    // await addNailItem('user123', { color: 'red' });

    // Assertions
    // expect(collection).toHaveBeenCalledWith(expect.any(Object), 'users/user123/nailItems');
    // expect(addDoc).toHaveBeenCalledWith(expect.any(Object), { color: 'red' });
  });

  it('should throw an error if addDoc fails', async () => {
    // (addDoc as vi.Mock).mockRejectedValueOnce(new Error('Firestore error'));
    // await expect(addNailItem('user123', { color: 'red' })).rejects.toThrow('Firestore error');
  });
});
```
