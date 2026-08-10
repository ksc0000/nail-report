# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. This task specifically targets enhancing test coverage by adding unit tests for core Firebase Firestore helper functions, as outlined in Phase 2.1 of the roadmap.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes to export functions if needed for testing)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only for adding `test` script or `vitest` configuration if absolutely necessary and minimal, but no new `npm` dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` (not relevant to this task)

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.

## Worker prompt

Your task is to implement unit tests for the helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Identify functions to test:** Focus on the main CRUD operations for `nailItems` within `src/lib/firestore.ts`, such as functions responsible for creating, reading, updating, and deleting nail items. For example, `createNailItem`, `getNailItems`, `getNailItem`, `updateNailItem`, `deleteNailItem`.
3.  **Use Vitest:** Write unit tests using Vitest. Assume Vitest is already configured in the project.
4.  **Mock Firebase SDK:** Utilize `vi.mock('firebase/firestore', ...)` to mock Firebase Firestore SDK interactions. This is crucial to ensure tests are isolated and do not require actual Firebase connections. Mock the `doc`, `collection`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc` methods as necessary to simulate successful operations and potential failures.
5.  **Test successful operations:** For each helper function, write tests that assert correct behavior when Firebase operations succeed.
6.  **Test error handling (optional but good to include if simple):** If `firestore.ts` includes explicit error handling, consider adding basic tests for these paths by mocking Firebase to throw errors.
7.  **Ensure comprehensive coverage for `firestore.ts`:** Aim to cover the primary logic paths within `src/lib/firestore.ts` with your new tests.

**Example of mocking Firebase Firestore (adapt as needed for the specific functions):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Import your functions

// Mock firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    addDoc: vi.fn((_colRef, data) => Promise.resolve({ id: 'mock-id', data })),
    getDoc: vi.fn(() => Promise.resolve({
      exists: vi.fn(() => true),
      data: vi.fn(() => ({ /* mock data */ })),
      id: 'mock-id',
    })),
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
        { id: 'mock-id-1', data: () => ({ /* mock data 1 */ }) },
        { id: 'mock-id-2', data: () => ({ /* mock data 2 */ }) },
      ],
    })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    query: vi.fn(() => ({})),
    where: vi.fn(() => ({})),
    // Mock other Firestore functions as needed
  };
});

describe('firestore.ts helpers', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should create a new nail item', async () => {
    const mockNailItemData = { /* ... your data ... */ };
    const uid = 'test-user-id';
    const result = await firestoreLib.createNailItem(mockNailItemData, uid);
    
    // Assertions
    expect(result).toEqual(expect.objectContaining({ id: 'mock-id' }));
    // You might also assert that addDoc was called with correct arguments
    // expect(addDoc).toHaveBeenCalledWith(expect.any(Object), mockNailItemData);
  });

  // Add tests for getNailItems, updateNailItem, deleteNailItem, etc.
});
```
