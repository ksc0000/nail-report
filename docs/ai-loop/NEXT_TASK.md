# Worker Prompt Template

## Context

The product is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firebase Firestore helper functions. Vitest is the chosen test runner for the project.

## Objective

Implement unit tests for the helper functions responsible for interacting with Firebase Firestore within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments if needed to facilitate testing)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `src/__tests__` (new directory if it doesn't exist)
- `vite.config.ts` (minor Vitest configuration if absolutely necessary for mocking, but prefer mocking directly in test files)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/lib/firestore.test.ts`.
- Mock Firebase SDK functions used in `src/lib/firestore.ts` (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) using `vi.mock` or similar Vitest mocking utilities.
- Write unit tests for at least two primary Firestore helper functions in `src/lib/firestore.ts` (e.g., functions that handle `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`).
- Ensure tests cover both successful execution paths and basic error handling where applicable (e.g., a rejected promise for a failed operation).
- Run `npm run test` to verify tests pass.
- Run `npm run build && npm run lint` before finishing.

## Worker prompt

You are tasked with adding unit tests to the `src/lib/firestore.ts` file.

1.  **Create a test file**: If it doesn't exist, create the directory `src/__tests__/lib/` and then create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Inside `src/__tests__/lib/firestore.test.ts`, use Vitest's `vi.mock` to mock the Firebase Firestore SDK functions that `src/lib/firestore.ts` depends on. This includes mocking `getFirestore`, `collection`, `doc`, and the various CRUD operations like `getDocs`, `addDoc`, `updateDoc`, and `deleteDoc` to control their return values and side effects during tests.
3.  **Write Tests**: Identify at least two core helper functions within `src/lib/firestore.ts` that interact with Firestore (e.g., functions responsible for fetching a list of nail items, adding a new item, updating an item, or deleting an item). Write comprehensive unit tests for these functions.
    *   **Success Cases**: Test that the functions correctly process data and call the mocked Firebase functions with the expected arguments.
    *   **Error Cases**: Add at least one test case per chosen function that simulates a failure from the mocked Firebase SDK (e.g., a Firestore operation throws an error or returns a rejected promise) and verifies that `src/lib/firestore.ts` handles this error gracefully (e.g., re-throws it, logs it, or returns a specific error value).
4.  **Run Tests**: Execute `npm run test` to ensure all new tests pass.
5.  **Lint and Build**: Ensure the project still builds and passes lint checks by running `npm run build && npm run lint`.

### Example Mocking Idea:
```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { collection, getDocs, getFirestore, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getNailItems, addNailItem } from '../../lib/firestore'; // Assuming these functions exist

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importActual) => {
  const actual = await importActual<typeof import('firebase/firestore')>();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({})), // Mock collection
    doc: vi.fn(() => ({})), // Mock doc
    getDocs: vi.fn(() => ({
      forEach: vi.fn((cb) => {
        cb({ id: '1', data: () => ({ name: 'Nail A' }) });
        cb({ id: '2', data: () => ({ name: 'Nail B' }) });
      }),
    })),
    addDoc: vi.fn((_colRef, data) => Promise.resolve({ id: 'newId', path: 'path/to/newId', ...data })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
  };
});

describe('firestore helpers', () => {
  it('should fetch nail items correctly', async () => {
    const items = await getNailItems('someUserId');
    expect(items).toEqual([
      { id: '1', name: 'Nail A' },
      { id: '2', name: 'Nail B' },
    ]);
    expect(getFirestore).toHaveBeenCalled();
    expect(collection).toHaveBeenCalledWith(expect.any(Object), 'users/someUserId/nailItems');
    expect(getDocs).toHaveBeenCalled();
  });

  it('should add a nail item', async () => {
    const newItem = { name: 'New Nail', color: 'red' };
    const addedItem = await addNailItem('someUserId', newItem);
    expect(addDoc).toHaveBeenCalledWith(expect.any(Object), newItem);
    expect(addedItem).toEqual({ id: 'newId', name: 'New Nail', color: 'red' });
  });

  it('should handle errors when fetching nail items', async () => {
    // Override mock for this specific test
    (getDocs as vi.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    await expect(getNailItems('someUserId')).rejects.toThrow('Failed to fetch');
  });

  // ... add more tests for updateNailItem, deleteNailItem, etc.
});
```

---

## Summary of what changed

- A new test file `src/__tests__/lib/firestore.test.ts` was created.
- Firebase Firestore SDK functions were mocked using `vi.mock`.
- Unit tests were added for `getNailItems` and `addNailItem` (or similar helper functions).
- Tests cover successful scenarios and basic error handling.

## Changed files list

- `src/__tests__/lib/firestore.test.ts`
- `src/lib/firestore.ts` (potentially minor changes to export functions for testing or fix small bugs, within line limit)

## Commands run and results

```bash
npm install # if new dependencies were needed (not for this task as Vitest is assumed installed)
npm run test # all new tests pass
npm run build # successful build
npm run lint # no linting errors
```

## Known issues or limitations

- The current task focuses on `firestore.ts`; `storage.ts` and `auth.ts` still require their own unit tests.
- Mocking might need refinement depending on the complexity of `firestore.ts` functions.

## Suggested next task

Add Vitest + unit tests for `src/lib/storage.ts` helpers.
