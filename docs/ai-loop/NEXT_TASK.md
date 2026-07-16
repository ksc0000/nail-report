# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase utility functions.

## Objective

Implement unit tests for the `addNailItem` and `getNailItems` functions located in `src/lib/firestore.ts` using Vitest. Mock the Firebase SDK to ensure tests are isolated and run efficiently.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, minor refactors)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if Vitest configuration is required)
- `package.json` (only to add `test` script if missing, no new dependencies)

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

### Worker prompt

Your task is to add unit tests for the `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest environment:**
    *   Configure Vitest to mock the Firebase Firestore SDK (e.g., using `vi.mock('firebase/firestore')`) to prevent actual Firebase calls during tests.
    *   Ensure that functions like `collection`, `addDoc`, `getDocs`, `query`, `orderBy`, `where`, and `doc` (if used internally by `addNailItem`/`getNailItems`) are mocked to return predictable values.
3.  **Write tests for `addNailItem`:**
    *   Test successful addition of a nail item, verifying that `addDoc` is called with the correct collection and data.
    *   Test error handling (e.g., if `addDoc` throws an error).
4.  **Write tests for `getNailItems`:**
    *   Test successful retrieval of multiple nail items, ensuring `getDocs` and `query` are called correctly and that the returned data is transformed as expected.
    *   Test retrieving items for a specific user ID.
    *   Test error handling (e.g., if `getDocs` throws an error).
5.  **Run tests:** Use `npm run test` (or `vitest`) to ensure all new tests pass.

**Example mocking strategy:**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { addNailItem, getNailItems } from '../lib/firestore'; // Adjust path

// Mock Firebase Firestore functions
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
  collection: vi.fn(() => ({ type: 'collectionRef', path: 'nailItems' })),
  addDoc: vi.fn(async () => ({ id: 'new-id-123', get: () => ({ /* mock data */ }) })),
  getDocs: vi.fn(async () => ({
    empty: false,
    docs: [
      { id: 'doc1', data: () => ({ userId: 'user1', tag: 'red', createdAt: new Date() }) },
      { id: 'doc2', data: () => ({ userId: 'user1', tag: 'blue', createdAt: new Date() }) },
    ],
  })),
  query: vi.fn(() => ({ type: 'query' })),
  orderBy: vi.fn(() => ({ type: 'orderedQuery' })),
  where: vi.fn(() => ({ type: 'filteredQuery' })),
  // Mock other Firestore functions as needed
}));

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addNailItem', () => {
    it('should add a new nail item to the collection', async () => {
      const mockItem = { userId: 'testUser', tag: 'green', imageUrl: 'url', notes: 'test' };
      const itemId = await addNailItem(mockItem);

      expect(collection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
        ...mockItem,
        createdAt: expect.any(Date),
      }));
      expect(itemId).toBe('new-id-123');
    });

    // Add error handling test
  });

  describe('getNailItems', () => {
    it('should retrieve nail items for a given user', async () => {
      const items = await getNailItems('user1');

      expect(collection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('userId', '==', 'user1');
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(getDocs).toHaveBeenCalled();
      expect(items).toEqual([
        { id: 'doc1', userId: 'user1', tag: 'red', createdAt: expect.any(Date) },
        { id: 'doc2', userId: 'user1', tag: 'blue', createdAt: expect.any(Date) },
      ]);
    });

    // Add error handling test
  });
});
```
