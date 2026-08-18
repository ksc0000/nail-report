# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. The current state indicates that a "First substantive task" is pending. This task directly addresses Phase 2.1: Test coverage, specifically for Firestore helper functions.

## Objective

Implement unit tests for `src/lib/firestore.ts` helper functions using Vitest, specifically focusing on `getNailItems` and `addNailItem`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor adjustments if needed for testability)
-   `src/__tests__/firestore.test.ts` (new file)
-   `vite.config.ts` (only if Vitest setup for tests needs minor configuration to correctly run the new test file, e.g., glob patterns, but prefer to avoid if possible)

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

## Worker prompt

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK:** Use `vi.mock('firebase/firestore')` at the top of your test file to mock Firestore functions (e.g., `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`). Ensure that calls to Firestore methods are intercepted and return mock data or resolve/reject as expected.
3.  **Write tests for `getNailItems`:**
    *   Test that `getNailItems` correctly fetches and transforms data from the mocked Firestore collection.
    *   Test handling of an empty collection.
    *   Test error scenarios (e.g., if `getDocs` throws an error).
4.  **Write tests for `addNailItem`:**
    *   Test that `addNailItem` correctly calls `addDoc` with the provided data and returns the expected ID.
    *   Test error scenarios (e.g., if `addDoc` throws an error).
5.  **Run tests:** Ensure all new tests pass using `npm run test` (or the equivalent Vitest command).
6.  **Lint and Build:** Before submitting, ensure the project lints and builds successfully.

**Example Mocking Pattern (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getNailItems, addNailItem } from '../lib/firestore'; // Import your functions

// Mock the firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...mod,
    collection: vi.fn(() => ({ type: 'mockCollectionRef' })),
    doc: vi.fn((ref, id) => ({ type: 'mockDocRef', id })),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn((_col, ..._constraints) => ({ type: 'mockQuery' })),
    where: vi.fn((_field, _op, _value) => ({ type: 'mockWhere' })),
    orderBy: vi.fn((_field, _direction) => ({ type: 'mockOrderBy' })),
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNailItems', () => {
    it('should fetch nail items correctly', async () => {
      // Mock getDocs to return specific data
      (getDocs as vi.Mock).mockResolvedValue({
        empty: false,
        docs: [
          { id: '1', data: () => ({ name: 'Polish A' }) },
          { id: '2', data: () => ({ name: 'Polish B' }) },
        ],
      });

      const items = await getNailItems('userId');
      expect(items).toEqual([
        { id: '1', name: 'Polish A' },
        { id: '2', name: 'Polish B' },
      ]);
      expect(collection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'userId');
    });

    // Add more tests for empty data, errors, etc.
  });

  describe('addNailItem', () => {
    it('should add a new nail item and return its ID', async () => {
      (addDoc as vi.Mock).mockResolvedValue({ id: 'new-id' });
      const newItemData = { name: 'New Polish', userId: 'userId' };

      const id = await addNailItem(newItemData);
      expect(id).toBe('new-id');
      expect(collection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), newItemData);
    });

    // Add more tests for errors, etc.
  });
});
```
