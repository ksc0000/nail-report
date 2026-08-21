```markdown
# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task initiates the test coverage effort by adding unit tests for core Firebase helper functions.

## Objective

Add unit tests for helper functions within `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/lib/__tests__/firestore.test.ts` (new file)
- `package.json` (only to add a `test` script command if not already present, e.g., `vitest`)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, Vitest is assumed to be present as dev dependency)
- Firebase deploy commands
- Secrets and credentials
- Any files or directories outside `src/lib/` and its `__tests__` subdirectory.

## Requirements

- Keep diff ≤ 150 lines.
- Create `src/lib/__tests__/firestore.test.ts`.
- Mock Firebase SDK (specifically `firebase/firestore`) using `vi.mock`.
- Write unit tests for at least two helper functions in `src/lib/firestore.ts`, such as `addNailItem` and `deleteNailItem`, ensuring they are tested in isolation using mocks.
- Tests should verify the correct arguments are passed to the mocked Firebase functions and that return values are handled as expected.
- Run `npm run build && npm run lint && npm run test` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker prompt

You are Jules, an expert React/TypeScript developer. Your current task is to implement unit tests for Firebase Firestore helper functions.

1.  **Create Test File:** Create a new file `src/lib/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore:** Within `firestore.test.ts`, mock the `firebase/firestore` module to control its behavior during tests. You will need to mock functions like `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, and `getDocs` as necessary to test the helper functions in `src/lib/firestore.ts`.
3.  **Test Helper Functions:**
    *   Identify at least two helper functions in `src/lib/firestore.ts` that interact with Firestore (e.g., `addNailItem`, `deleteNailItem`, `getNailItems`, `updateNailItem`).
    *   Write unit tests for these two functions.
    *   For each test, ensure you assert that the mocked Firestore functions are called with the expected arguments.
    *   Use mock data to simulate Firestore responses.
4.  **Run Tests:** Execute `npm run test` (assuming `vitest` is configured as the test runner) and ensure all new tests pass.
5.  **Lint and Build:** Run `npm run lint` and `npm run build` to confirm no new errors or warnings are introduced.

**Example of mocking structure (adapt as needed for the specific functions):**

```typescript
// src/lib/__tests__/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'; // Import necessary functions to mock

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

// Import the functions to be tested from firestore.ts
import { addNailItem, deleteNailItem } from '../firestore';

describe('firestore helpers', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addNailItem', () => {
    it('should call addDoc with correct collection ref and data', async () => {
      // Setup mock return values
      (collection as vi.Mock).mockReturnValue({}); // Mock a CollectionReference
      (addDoc as vi.Mock).mockResolvedValue({ id: 'mockItemId' });

      const uid = 'testUser';
      const itemData = { name: 'Test Polish', brand: 'Test Brand' };
      const result = await addNailItem(uid, itemData);

      expect(collection).toHaveBeenCalledWith(expect.any(Object), `users/${uid}/nailItems`);
      expect(addDoc).toHaveBeenCalledWith(expect.any(Object), itemData);
      expect(result).toEqual('mockItemId');
    });

    // Add error handling test here
  });

  describe('deleteNailItem', () => {
    it('should call deleteDoc with correct document ref', async () => {
      (doc as vi.Mock).mockReturnValue({}); // Mock a DocumentReference
      (deleteDoc as vi.Mock).mockResolvedValue(undefined);

      const uid = 'testUser';
      const itemId = 'testItemId';
      await deleteNailItem(uid, itemId);

      expect(doc).toHaveBeenCalledWith(expect.any(Object), `users/${uid}/nailItems`, itemId);
      expect(deleteDoc).toHaveBeenCalledWith(expect.any(Object));
    });

    // Add error handling test here
  });
});
```

```
```
