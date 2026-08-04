# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core Firebase helper functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (minimal modifications if needed for testability, but primarily for understanding)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `package.json` (only to add a `test` script if not present, no new dependencies)
-   `vite.config.ts` (if Vitest configuration is needed)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval, `vitest` should already be a dev dependency or added by a separate meta-task)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Prefer adding tests when touching `src/lib/` files.
-   Report follow-up items as comments, not additional code.

## Worker Prompt

Your task is to implement unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize Vitest's mocking capabilities (`vi.mock`) to mock the Firebase Firestore SDK functions (`getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `getDoc` etc.) that are used within `src/lib/firestore.ts`. This ensures tests are isolated and do not interact with actual Firebase services.
3.  **Implement Unit Tests**: Write tests for at least two core CRUD operations provided by `src/lib/firestore.ts`. Focus on:
    *   `addNailItem` (or similar function for creating a new item)
    *   `getNailItem` (or similar function for retrieving a single item)
    *   Ensure each test asserts the correct interaction with the mocked Firebase SDK (e.g., `expect(addDoc).toHaveBeenCalledWith(...)`, `expect(getDoc).toHaveBeenCalledWith(...)`).
4.  **Run Tests**: Ensure tests pass using `npm test` (or the appropriate Vitest command).

**Example of mocking Firebase**:

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { doc, getDoc, getFirestore } from 'firebase/firestore'; // Import necessary Firebase functions

// Mock Firebase Firestore SDK
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return a dummy object
    collection: vi.fn(() => ({})), // Mock collection
    doc: vi.fn((db, path, id) => ({ __path: `${path}/${id}`, id })), // Simple mock for doc reference
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
  };
});

// Assuming your firestore.ts exports functions like this:
import { addNailItem, getNailItem } from '../lib/firestore'; // Adjust path as necessary

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should add a new nail item', async () => {
    const mockNailItem = { userId: 'testUser', name: 'New Polish' };
    (getFirestore as vi.Mock).mockReturnValue({}); // Ensure getFirestore returns something
    (addDoc as vi.Mock).mockResolvedValueOnce({ id: 'newId123' });

    const result = await addNailItem('testUser', mockNailItem);

    expect(addDoc).toHaveBeenCalledTimes(1);
    // You'd need to mock 'collection' and 'getFirestore' more robustly if your addNailItem uses them directly
    // expect(collection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
    expect(result).toEqual('newId123'); // Or whatever addNailItem is expected to return
  });

  it('should retrieve a nail item by ID', async () => {
    const mockDocData = { userId: 'testUser', name: 'Old Polish' };
    (getDoc as vi.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockDocData,
      id: 'existingId456',
    });
    (getFirestore as vi.Mock).mockReturnValue({});
    (doc as vi.Mock).mockReturnValue({ path: 'nailItems/existingId456' }); // Mock doc return value

    const result = await getNailItem('testUser', 'existingId456');

    expect(getDoc).toHaveBeenCalledTimes(1);
    // expect(doc).toHaveBeenCalledWith(expect.any(Object), 'nailItems', 'existingId456');
    expect(result).toEqual({ ...mockDocData, id: 'existingId456' });
  });

  // Add more tests for update, delete, and list operations
});
```
