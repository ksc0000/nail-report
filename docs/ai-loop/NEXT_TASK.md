# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task specifically addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest and `vi.mock` for Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (minor additions for Vitest setup if absolutely required for mocking, but prefer to assume Vitest is configured for basic tests)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts` to house the new tests.
- Use `vitest` for the test runner and `vi.mock` to mock Firebase SDK dependencies (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`).
- Cover at least `addNailItem` and `getNailItems` with basic unit tests.
- Each test suite/test case should be descriptive.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` to verify tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest and Mocking**:
    *   Ensure Vitest is correctly configured (no need to modify `vite.config.ts` unless absolutely necessary for mocking setup).
    *   Use `vi.mock` to mock Firebase Firestore SDK functions such as `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`. You will need to simulate their behavior, for instance, `addDoc` returning a mock `DocumentReference`.
    *   The mocking should ensure that no actual calls are made to Firebase.
3.  **Implement Tests for `addNailItem`**:
    *   Write a test suite for `addNailItem`.
    *   Test that `addDoc` is called with the correct collection and data.
    *   Verify the function returns the expected result (e.g., the ID of the new item).
4.  **Implement Tests for `getNailItems`**:
    *   Write a test suite for `getNailItems`.
    *   Mock `getDocs` to return a snapshot containing mock `QueryDocumentSnapshot` objects.
    *   Verify that `getNailItems` correctly transforms the mock snapshot data into the expected array of `NailItem` objects.
    *   Consider testing sorting functionality if `getNailItems` takes sort parameters.
5.  **Run Checks**:
    *   Ensure all tests pass by running `npm test`.
    *   Run `npm run build` and `npm run lint` to confirm no build or linting issues.

**Example Mocking Structure (conceptual):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import * as firestoreModule from '../lib/firestore'; // Import all from the module

// Mock Firebase Firestore SDK
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return an empty object
    collection: vi.fn(() => ({
      id: 'mock-collection',
      path: 'mock-collection'
    })),
    doc: vi.fn(() => ({
      id: 'mock-doc-id',
      path: 'mock-collection/mock-doc-id'
    })),
    addDoc: vi.fn(async (colRef, data) => ({
      id: 'new-mock-id',
      path: `${colRef.path}/new-mock-id`,
    })),
    getDocs: vi.fn(async (q) => ({
      empty: false,
      docs: [
        {
          id: 'item1',
          data: () => ({ name: 'Nail Polish A', tags: [], imageUrl: 'urlA' }),
          exists: true,
        },
        {
          id: 'item2',
          data: () => ({ name: 'Nail Polish B', tags: [], imageUrl: 'urlB' }),
          exists: true,
        },
      ],
    })),
    updateDoc: vi.fn(async () => {}),
    deleteDoc: vi.fn(async () => {}),
    query: vi.fn((c, ...constraints) => ({
        _query: { collection: c, constraints: constraints } // Simple representation
    })),
    orderBy: vi.fn((field, direction) => ({ field, direction }))
  };
});

describe('firestore.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addNailItem', () => {
    it('should call addDoc with correct collection and data', async () => {
      const mockItemData = { name: 'Test Item', tags: ['red'], imageUrl: 'http://test.com/img.jpg', userId: 'user123' };
      const expectedDocRef = { id: 'new-mock-id', path: 'mock-collection/new-mock-id' };
      
      const result = await firestoreModule.addNailItem(mockItemData);

      expect(addDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'nailItems' }), // Check collection path
        expect.objectContaining(mockItemData)
      );
      expect(result).toEqual(expectedDocRef.id);
    });
  });

  describe('getNailItems', () => {
    it('should fetch and return a list of nail items', async () => {
      const userId = 'user123';
      const items = await firestoreModule.getNailItems(userId);

      expect(getDocs).toHaveBeenCalled();
      expect(items).toEqual([
        { id: 'item1', name: 'Nail Polish A', tags: [], imageUrl: 'urlA' },
        { id: 'item2', name: 'Nail Polish B', tags: [], imageUrl: 'urlB' },
      ]);
    });
  });
});
```
