# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically addresses the "Test coverage" goal by adding unit tests for a core Firebase utility file. Vitest is the designated test runner.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts`. This involves creating a new test file and mocking Firebase SDK interactions to ensure the functions' logic is tested in isolation.

## Allowed Scope

-   `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, or minor refactors)
-   `src/__tests__/` (creation of new test files, e.g., `src/__tests__/firestore.test.ts`)
-   `package.json` (only to confirm `vitest` is in `devDependencies`, no additions)
-   `vite.config.ts` (minor additions if test setup is incomplete, but assume Vitest is mostly configured)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` (adding new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Use Vitest for testing. Assume `vitest` is already installed as a `devDependency`.
-   Mock Firebase SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`) to test the logic within `src/lib/firestore.ts` without actual Firestore calls.
-   Focus on the main CRUD helper functions (e.g., for adding, getting, updating, deleting nail items or related data) within `src/lib/firestore.ts`.
-   Keep the overall diff for this task ≤ 150 lines.
-   Run `npm run build && npm run lint && npm run test` before finishing.
-   Ensure existing functionality remains unchanged.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Implement unit tests for the helper functions within `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use `vi.mock` from Vitest to mock Firestore methods (`getFirestore`, `collection`, `doc`, `getDocs`, `setDoc`, `updateDoc`, `deleteDoc`, etc.) to control their return values and observe calls.
3.  **Test core helper functions**: Write tests for functions in `src/lib/firestore.ts` that interact with Firestore (e.g., functions for fetching all nail items, adding a new item, updating an item, deleting an item).
4.  **Verify behavior**: Ensure the helper functions correctly interact with the mocked Firestore (e.g., calling `setDoc` with correct arguments) and return expected results.
5.  **Run tests**: Confirm tests pass using `npm run test`.

**Example of mocking Firestore (conceptual):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreModule from 'firebase/firestore'; // Import everything to mock specific functions

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return a dummy object
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    getDocs: vi.fn(() => ({
      // Mock for getDocs to return a QuerySnapshot
      forEach: vi.fn((callback) => {
        const mockDocs = [
          { id: '1', data: () => ({ name: 'Nail 1' }) },
          { id: '2', data: () => ({ name: 'Nail 2' }) },
        ];
        mockDocs.forEach(callback);
      }),
      docs: [
        { id: '1', data: () => ({ name: 'Nail 1' }) },
        { id: '2', data: () => ({ name: 'Nail 2' }) },
      ],
    })),
    setDoc: vi.fn(() => Promise.resolve()),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
  };
});

// Import the functions you want to test from src/lib/firestore.ts
import { getAllNailItems, addNailItem } from '../lib/firestore'; // Adjust path as needed

describe('firestore helpers', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('getAllNailItems should fetch and map items', async () => {
    const items = await getAllNailItems();
    expect(firestoreModule.collection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
    expect(firestoreModule.getDocs).toHaveBeenCalled();
    expect(items).toEqual([
      { id: '1', name: 'Nail 1' },
      { id: '2', name: 'Nail 2' },
    ]);
  });

  it('addNailItem should call setDoc with correct data', async () => {
    const newItem = { name: 'New Nail', color: 'red' };
    await addNailItem(newItem);
    expect(firestoreModule.setDoc).toHaveBeenCalledWith(expect.any(Object), newItem); // Mocking doc() would be more precise here
  });

  // Add more tests for update, delete, and other functions
});
```
