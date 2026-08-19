```markdown
# Worker Prompt Template

## Context

The current phase is 2.0, focusing on improving stability, test coverage, and UX. The first priority within this phase is 2.1 Test coverage. This task initiates unit testing for core utility functions.

## Objective

Implement Vitest unit tests for the helper functions in `src/lib/firestore.ts`, focusing on mocking Firebase SDK dependencies.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, or minor refactors to improve testability)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if minor configuration is needed for Vitest, but avoid adding new dependencies)

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

## Worker Prompt

1.  **Locate Target File**: Identify the helper functions within `src/lib/firestore.ts`. These typically interact directly with the Firebase Firestore SDK instance (`db`).
2.  **Create Test File**: Create a new test file at `src/__tests__/lib/firestore.test.ts`.
3.  **Set up Vitest and Mocking**:
    *   Assume Vitest is already installed and configured.
    *   Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`). You will need to mock the `db` instance and its chainable methods like `collection`, `doc`, `get`, `add`, `update`, `delete`.
    *   A basic mock for the Firestore instance and collection methods will be necessary to prevent actual database calls during tests.
4.  **Write Unit Tests**:
    *   Implement at least one comprehensive unit test for a function that interacts with Firestore, such as `getNailItems` or `addNailItem`.
    *   The test should verify that the function calls the correct Firestore methods with the expected arguments and handles the returned data as anticipated.
    *   Focus on isolated unit testing, ensuring that the tests only cover the logic within `firestore.ts` and not the entire Firebase integration.

**Example Mocking Approach (Conceptual - adjust to actual `firestore.ts` structure):**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { db } from '../../lib/firebase'; // Assuming db is exported or can be mocked similarly
import { getNailItems, addNailItem } from '../../lib/firestore'; // Import functions to test

// Mock firebase/firestore module if 'db' is imported directly from firebase
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  const mockDoc = vi.fn(() => ({
    get: vi.fn(() => Promise.resolve({ exists: true, data: () => ({ id: 'mockId' }) })),
    set: vi.fn(() => Promise.resolve()),
    update: vi.fn(() => Promise.resolve()),
    delete: vi.fn(() => Promise.resolve()),
  }));
  const mockCollection = vi.fn(() => ({
    add: vi.fn(() => Promise.resolve(mockDoc())),
    doc: mockDoc,
    get: vi.fn(() => Promise.resolve({ docs: [], empty: true })), // Default for getNailItems
    where: vi.fn(() => mockCollection()),
    orderBy: vi.fn(() => mockCollection()),
  }));
  return {
    ...actual,
    getFirestore: vi.fn(() => ({
      collection: mockCollection,
    })),
    // Mock other necessary firestore functions like query, getDocs, etc.
  };
});

// If 'db' is an already initialized instance, you might mock its methods directly
// vi.mock('../../lib/firebase', () => ({
//   db: {
//     collection: vi.fn(() => ({
//       add: vi.fn(() => Promise.resolve({ id: 'mockItemId' })),
//       doc: vi.fn((id) => ({
//         get: vi.fn(() => Promise.resolve({ exists: true, data: () => ({ id }) })),
//         set: vi.fn(() => Promise.resolve()),
//       })),
//       get: vi.fn(() => Promise.resolve({ docs: [], empty: true })),
//     })),
//   },
// }));


describe('firestore helpers', () => {
  let mockCollection;
  let mockDoc;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockDoc = {
      id: 'testDocId',
      data: () => ({
        id: 'testDocId',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      exists: true,
      ref: { update: vi.fn(() => Promise.resolve()) },
      delete: vi.fn(() => Promise.resolve()),
    };
    mockCollection = {
      add: vi.fn(() => Promise.resolve({ id: 'newDocId' })),
      doc: vi.fn(() => ({
        get: vi.fn(() => Promise.resolve(mockDoc)),
        set: vi.fn(() => Promise.resolve()),
        update: vi.fn(() => Promise.resolve()),
        delete: vi.fn(() => Promise.resolve()),
      })),
      get: vi.fn(() => Promise.resolve({ docs: [mockDoc], empty: false })),
      where: vi.fn(() => mockCollection), // Chainable
      orderBy: vi.fn(() => mockCollection), // Chainable
    };
    // Ensure the mocked collection is returned when `db.collection` is called
    // This depends on how 'db' is exposed and initialized.
    // If db.collection is already mocked by vi.mock above, this step might be different.
    // For now, let's assume 'db.collection' needs to be configured.
    // This part requires careful inspection of the actual firebase setup in `src/lib/firebase.ts` or `src/lib/firestore.ts`.
    // Example if db is a global mock or imported:
    if (db && (db as any).collection) {
        (db.collection as vi.Mock).mockReturnValue(mockCollection);
    }
  });


  it('should fetch nail items successfully', async () => {
    // Manually set up mock response for getDocs/collection.get()
    const mockNailItems = [
      { id: 'item1', name: 'Polish 1', userId: 'user123' },
      { id: 'item2', name: 'Polish 2', userId: 'user123' },
    ];
    (mockCollection.get as vi.Mock).mockResolvedValueOnce({
      docs: mockNailItems.map(item => ({
        id: item.id,
        data: () => item,
      })),
      empty: false,
    });

    const items = await getNailItems('user123');
    expect(items).toEqual(mockNailItems);
    expect((db.collection as vi.Mock)).toHaveBeenCalledWith('nailItems');
    expect((mockCollection.where as vi.Mock)).toHaveBeenCalledWith('userId', '==', 'user123');
    expect((mockCollection.orderBy as vi.Mock)).toHaveBeenCalledWith('createdAt', 'desc');
    expect((mockCollection.get as vi.Mock)).toHaveBeenCalledTimes(1);
  });

  it('should add a new nail item', async () => {
    const newItem = {
      name: 'New Polish',
      brand: 'BrandX',
      userId: 'testUser',
      imageUrl: '',
      tags: [],
    };
    const expectedId = 'newDocId';
    (mockCollection.add as vi.Mock).mockResolvedValueOnce({ id: expectedId });

    const addedItem = await addNailItem('testUser', newItem);

    expect(addedItem).toEqual(expect.objectContaining({ id: expectedId, ...newItem }));
    expect((db.collection as vi.Mock)).toHaveBeenCalledWith('nailItems');
    expect((mockCollection.add as vi.Mock)).toHaveBeenCalledWith(
      expect.objectContaining({
        ...newItem,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });
});
```

This task will ensure basic test coverage for the Firestore helper functions, which is crucial for stability and future development.
```
