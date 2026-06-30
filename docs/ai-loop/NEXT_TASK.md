# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the first item under "2.1 Test coverage" and is the highest priority Jules-ready task.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. Focus on mocking Firebase SDK calls to test the logic of these helpers in isolation.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, but prefer not)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only if absolutely necessary for Vitest configuration, e.g., alias setup, but assume Vitest is already configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`). This is crucial to prevent actual database calls during tests and to control the return values of Firestore operations.
    *   Specifically, mock functions like `doc`, `collection`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where` from `firebase/firestore`.
3.  **Identify key functions to test:** Focus on the main CRUD operations in `src/lib/firestore.ts`, such as `addNailItem`, `updateNailItem`, `deleteNailItem`, and `getNailItems`.
4.  **Write unit tests:**
    *   For `addNailItem`: Test that it calls `addDoc` with the correct collection reference and data.
    *   For `updateNailItem`: Test that it calls `updateDoc` with the correct document reference and data.
    *   For `deleteNailItem`: Test that it calls `deleteDoc` with the correct document reference.
    *   For `getNailItems` or `getNailItemById`: Test that it correctly queries Firestore and transforms the snapshot data into the expected format.
5.  **Assert outcomes:** Use Vitest's `expect` assertions to verify that the mocked Firebase functions are called with the correct arguments and that your helper functions return the expected data.
6.  Ensure all tests are self-contained and do not rely on external resources.

**Example mocking approach:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreModule from 'firebase/firestore'; // Import the actual module

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
    collection: vi.fn(() => ({ type: 'collectionRef' })),
    doc: vi.fn(() => ({ type: 'docRef' })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
    getDoc: vi.fn(() => Promise.resolve({
      exists: vi.fn(() => true),
      data: vi.fn(() => ({ /* mock data */ })),
      id: 'mock-doc-id'
    })),
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
        {
          id: 'mock-doc-1',
          data: () => ({ /* mock data 1 */ }),
        },
        {
          id: 'mock-doc-2',
          data: () => ({ /* mock data 2 */ }),
        },
      ],
    })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    query: vi.fn((c, ...q) => ({ type: 'query' })), // Mock query if used
    where: vi.fn((field, op, value) => ({ type: 'where', field, op, value })), // Mock where if used
  };
});

// Import the functions to be tested from your actual firestore.ts
import { addNailItem, getNailItems } from '../lib/firestore';

describe('firestore helpers', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();
  });

  it('addNailItem should call addDoc with correct arguments', async () => {
    const mockNailItemData = { description: 'test', tags: [] };
    const mockUser = { uid: 'user123' };
    await addNailItem(mockUser, mockNailItemData);

    expect(firestoreModule.collection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
    expect(firestoreModule.addDoc).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'collectionRef' }),
      expect.objectContaining({ userId: 'user123', description: 'test' })
    );
  });

  // Add more tests for updateNailItem, deleteNailItem, getNailItems, etc.
});
```
