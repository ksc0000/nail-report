# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Implement exactly one bounded task from Phase 2 of the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (for the code under test)
- `src/__tests__/` (for new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, unlikely for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any other files not explicitly mentioned in Allowed Scope

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to add unit tests for helper functions located in `src/lib/firestore.ts` using Vitest.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize Vitest's mocking capabilities (`vi.mock`) to mock necessary Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `orderBy`, `limit`, `where`). Refer to existing mock patterns if any, or create them following Vitest best practices for Firebase.
3.  **Test specific functions**: Implement tests for at least two of the following functions from `src/lib/firestore.ts`:
    *   `addItem`
    *   `updateItem`
    *   `deleteItem`
    *   `getItems` (focus on the basic fetch, not query variations yet)
4.  **Assertions**: Ensure tests make meaningful assertions about function calls, return values, and error handling where applicable.
5.  **Run tests**: Verify all new tests pass by running `npm run test`.
6.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass without errors.

**Example of mocking Firestore (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getFirestore } from 'firebase/firestore';
import * as firestoreModule from 'firebase/firestore'; // Import as module to mock specific functions
import { addItem, updateItem, deleteItem, getItems } from '../lib/firestore'; // Your functions

// Mock Firebase Firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({ type: 'collectionRef' })), // Mock collection
    doc: vi.fn(() => ({ type: 'docRef' })), // Mock doc
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    getDocs: vi.fn(() => Promise.resolve({
      forEach: (callback: any) => {
        // Mock snapshot data for getItems
        callback({ id: 'item1', data: () => ({ name: 'Test Nail 1' }) });
        callback({ id: 'item2', data: () => ({ name: 'Test Nail 2' }) });
      }
    })),
    // Mock query functions if needed for getItems
    query: vi.fn(() => ({ type: 'queryRef' })),
    orderBy: vi.fn(() => ({ type: 'queryRef' })),
    limit: vi.fn(() => ({ type: 'queryRef' })),
  };
});

describe('Firestore Helpers', () => {
  const mockUserId = 'user123';
  const mockNailItem = { name: 'New Nail', imageUrl: 'url.jpg' };
  const mockItemId = 'item456';

  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('addItem should call addDoc with correct arguments', async () => {
    await addItem(mockUserId, mockNailItem);
    expect(collection).toHaveBeenCalledWith(expect.any(Object), `users/${mockUserId}/nailItems`);
    expect(addDoc).toHaveBeenCalledWith(expect.any(Object), mockNailItem);
  });

  it('updateItem should call updateDoc with correct arguments', async () => {
    const updatedItem = { name: 'Updated Nail' };
    await updateItem(mockUserId, mockItemId, updatedItem);
    expect(doc).toHaveBeenCalledWith(expect.any(Object), `users/${mockUserId}/nailItems`, mockItemId);
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), updatedItem);
  });

  it('deleteItem should call deleteDoc with correct arguments', async () => {
    await deleteItem(mockUserId, mockItemId);
    expect(doc).toHaveBeenCalledWith(expect.any(Object), `users/${mockUserId}/nailItems`, mockItemId);
    expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
  });

  it('getItems should fetch items and return correctly formatted data', async () => {
    const items = await getItems(mockUserId);
    expect(collection).toHaveBeenCalledWith(expect.any(Object), `users/${mockUserId}/nailItems`);
    expect(getDocs).toHaveBeenCalled();
    expect(items).toEqual([
      { id: 'item1', name: 'Test Nail 1' },
      { id: 'item2', name: 'Test Nail 2' },
    ]);
  });
});
```
