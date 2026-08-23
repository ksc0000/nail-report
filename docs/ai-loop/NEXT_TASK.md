# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2. The `src/lib/firestore.ts` file contains core logic for interacting with Firebase Firestore. Adding unit tests for these helper functions is a foundational step towards improving the overall stability and ensuring correctness of data operations.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest. This task focuses on establishing a test suite for the core Firestore interactions.

## Allowed Scope

- `src/lib/firestore.ts` (for minor refactoring to improve testability if necessary, but primarily for its existing functions)
- `src/__tests__/firestore.test.ts` (new file for tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `deleteNailItem`, `getNailItems`, `subscribeToNailItems`, etc.).
- Mock the Firebase SDK (`firebase/firestore`) using Vitest's mocking capabilities to isolate the functions under test.
- Ensure tests cover basic success cases for the chosen functions.
- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your current task is to add unit tests for `src/lib/firestore.ts`.

1.  **Create a new test file**: In `src/__tests__`, create a new file named `firestore.test.ts`.
2.  **Mock Firebase SDK**: You will need to mock the `firebase/firestore` module to test these functions in isolation. Use `vi.mock` at the top of your test file to mock the necessary Firestore functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `onSnapshot`).
3.  **Identify functions to test**: Pick at least two distinct helper functions from `src/lib/firestore.ts` (e.g., `addNailItem` and `getNailItems`).
4.  **Write unit tests**: For each selected function, write one or more `test` blocks using `vitest` syntax. Focus on testing the expected behavior when the underlying mocked Firestore functions are called correctly.
5.  **Run tests**: Execute `npm test` to confirm your new tests pass.
6.  **Lint and Build**: Run `npm run lint` and `npm run build` to ensure no linting errors or build issues are introduced.

**Example structure for mocking Firestore:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Import the module under test

// Mock Firebase Firestore SDK
const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockOnSnapshot = vi.fn();
const mockCollection = vi.fn(() => ({
  id: 'mockCollectionRef', // Mock collection reference
}));
const mockDoc = vi.fn(() => ({
  id: 'mockDocRef', // Mock document reference
}));
const mockGetFirestore = vi.fn(() => ({
  // Mock Firestore instance
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: mockGetFirestore,
    collection: mockCollection,
    doc: mockDoc,
    addDoc: mockAddDoc,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    getDocs: mockGetDocs,
    onSnapshot: mockOnSnapshot,
    // ...mock other necessary functions
  };
});

describe('firestore.ts helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('addNailItem should call addDoc with correct data', async () => {
    const mockNailItem = { userId: '123', name: 'Test Item', tags: [] };
    mockAddDoc.mockResolvedValueOnce({ id: 'newId' });

    const result = await firestoreLib.addNailItem('123', mockNailItem);
    expect(mockAddDoc).toHaveBeenCalledWith(expect.any(Object), { ...mockNailItem, userId: '123' });
    expect(result).toBe('newId');
  });

  // Add more tests for other functions...
});
```
