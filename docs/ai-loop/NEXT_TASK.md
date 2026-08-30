# Worker Prompt Template

## Context

The product roadmap outlines Phase 2, which focuses on improving stability, test coverage, and UX. The first major goal within Phase 2 is to enhance test coverage, specifically by adding unit tests for Firebase helper functions. Vitest is already configured as the test runner.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The tests should mock the Firebase SDK using `vi.mock`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but primarily testing existing logic)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if `vitest` or testing-library is missing from devDependencies, but do not add new *functional* dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, beyond ensuring testing tools are present)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Create a new test file, `src/__tests__/firestore.test.ts`.
- Write unit tests for the core CRUD functions related to `nailItems` in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
- Ensure the Firebase/Firestore SDK is properly mocked using `vitest`'s `vi.mock` functionality to avoid actual Firebase calls during tests.
- Aim for good test coverage for the tested functions, including successful operations and error handling.
- Keep diff ≤ 150 lines.
- Run `npm run test` and `npm run build && npm run lint` before finishing.
- Ensure all tests pass.

## Worker Prompt

Your task is to implement unit tests for the `src/lib/firestore.ts` module.

1.  **Create a new test file**: In `src/__tests__/`, create `firestore.test.ts`.
2.  **Mock Firebase SDK**: At the top of `firestore.test.ts`, implement `vi.mock` to mock the Firebase Firestore module. This mock should simulate the behavior of Firestore collections, documents, and queries (e.g., `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
3.  **Test Firestore helper functions**: Write `describe` blocks and `test` cases for the primary functions in `src/lib/firestore.ts` that interact with the `nailItems` collection. Focus on:
    *   `addNailItem`: Test successful addition.
    *   `getNailItems`: Test successful retrieval of a list of items (empty and non-empty).
    *   `updateNailItem`: Test successful update of an existing item.
    *   `deleteNailItem`: Test successful deletion of an item.
4.  **Error Handling (Optional but recommended if simple)**: If `firestore.ts` has explicit error handling logic, consider adding basic tests for error paths (e.g., mock a rejected promise from Firestore operations).
5.  **Run tests**: Execute `npm run test` to verify all new tests pass.
6.  **Lint and Build**: Ensure `npm run build && npm run lint` pass without errors or warnings.

**Example Mocking Pattern (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Import the functions you want to test from firestore.ts
import { addNailItem, getNailItems, updateNailItem, deleteNailItem } from '../lib/firestore';

// Mock Firebase and Firestore
const mockAddDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockDoc = vi.fn(() => ({ id: 'mock-doc-id' }));
const mockCollection = vi.fn(() => ({}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: mockCollection,
    doc: mockDoc,
    addDoc: mockAddDoc,
    getDocs: mockGetDocs,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    // Add other Firestore functions used in firestore.ts as needed
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a nail item successfully', async () => {
    mockAddDoc.mockResolvedValueOnce({ id: 'new-nail-id' });
    const userId = 'user123';
    const itemData = { name: 'Test Polish' };
    const result = await addNailItem(userId, itemData);
    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(), // firestore instance
      itemData
    );
    expect(result).toBe('new-nail-id');
  });

  // Add tests for getNailItems, updateNailItem, deleteNailItem
});
```
