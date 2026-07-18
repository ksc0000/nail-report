# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for the helper functions in `src/lib/firestore.ts` using Vitest. Focus on mocking Firebase SDK calls to test the logic of these functions in isolation.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing if necessary, but prefer to test existing exports)
- `src/__tests__/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (minimal modifications if absolutely required for Vitest setup, but assume Vitest is largely configured as per roadmap)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/__tests__/firestore.test.ts`.
- Mock Firebase Firestore SDK interactions (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`). Use `vi.mock` from Vitest.
- Write at least one unit test for each major CRUD operation function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure tests run successfully without actual Firebase calls.
- Run `npm run build && npm run lint` before finishing.

## Worker prompt

Your task is to add unit tests for the functions defined in `src/lib/firestore.ts`.

1.  **Create a new test file:** `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest environment:** Ensure Vitest is configured to run tests. If `vite.config.ts` needs a minor adjustment to include `src/__tests__` in test discovery, make only that minimal change.
3.  **Mock Firebase Firestore:** Use `vi.mock('firebase/firestore', ...)` to mock the Firebase Firestore SDK.
    *   Mock functions like `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, and any other Firestore-specific functions used in `src/lib/firestore.ts`.
    *   Your mocks should return predictable values or resolve promises as expected by the functions under test.
4.  **Write Unit Tests:**
    *   For each function in `src/lib/firestore.ts` that interacts with Firestore (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getNailItem`), write at least one `it` block.
    *   Each test should verify the correct behavior of the function, assuming the Firebase SDK mocks behave as expected. Focus on what the function *does* (e.g., calls `addDoc` with specific data, returns formatted data).
    *   Use `expect` assertions to check function return values, side effects on mocks, or that specific mock functions were called with correct arguments.
5.  **Run tests:** Execute `npm test` (or `vitest`) to ensure all new tests pass.
6.  **Lint and Build:** Run `npm run build && npm run lint` to verify code quality and build integrity.

**Example structure for mocking (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { addNailItem, getNailItems, updateNailItem, deleteNailItem, getNailItem } from '../lib/firestore'; // Adjust path if needed

// Mock Firebase Firestore SDK
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({ type: 'collectionRef' })), // Mock collection
    doc: vi.fn(() => ({ type: 'docRef' })), // Mock doc
    addDoc: vi.fn((colRef, data) => Promise.resolve({ id: 'mock-id', data })),
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
        { id: 'item1', data: () => ({ name: 'Polish 1', tags: ['red'], createdAt: new Date() }) },
        { id: 'item2', data: () => ({ name: 'Polish 2', tags: ['blue'], createdAt: new Date() }) },
      ],
      empty: false,
    })),
    getDoc: vi.fn(() => Promise.resolve({
        id: 'mock-item-id',
        exists: vi.fn(() => true),
        data: vi.fn(() => ({ name: 'Single Polish', tags: ['green'], createdAt: new Date() })),
    })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('addNailItem should call addDoc with correct data', async () => {
    const itemData = { name: 'New Polish', description: 'desc', imageUrl: 'url', tags: ['test'], createdAt: new Date() };
    const result = await addNailItem('user1', itemData);
    expect(addDoc).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'collectionRef' }), // Verify collection ref type
      expect.objectContaining(itemData)
    );
    expect(result).toEqual('mock-id');
  });

  // Add more tests for getNailItems, updateNailItem, deleteNailItem, getNailItem
});
```
