# Worker Prompt Template

## Context

The current phase is "2.0 Improve stability, test coverage, and UX." This task specifically addresses "2.1 Test coverage" by adding unit tests for core Firebase helper functions.

## Objective

Implement Vitest unit tests for selected helper functions within `src/lib/firestore.ts`, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability, if necessary)
- `src/__tests__/lib/firestore.test.ts` (new file)
- `vitest.config.ts` (if Vitest setup is incomplete, minimal additions)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- `src/App.css` or any other UI-related files

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

## Worker prompt

Your task is to add unit tests for `src/lib/firestore.ts` helper functions using Vitest.

1.  **Create a new test file**: `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK**: Use `vi.mock('firebase/firestore')` to mock the necessary Firestore functions (`doc`, `collection`, `getDoc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, etc.) and their return values. Focus on mimicking the behavior relevant to the `firestore.ts` helpers.
3.  **Write unit tests for `src/lib/firestore.ts` functions**:
    *   Start with `addNailItem` and `getNailItems`.
    *   Ensure tests cover successful operations and, if simple to mock, basic error scenarios (e.g., Firestore throwing an error).
    *   Verify that the Firestore functions are called with the correct arguments and that the `firestore.ts` helpers return the expected data or handle errors appropriately.
4.  **Do not modify `src/lib/firestore.ts` unless absolutely necessary for testability** (e.g., exporting an internal helper). Any such modifications should be minimal.
5.  **Run tests**: `npm test` to ensure new tests pass.

**Example for mocking Firestore:**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'; // Import actual functions for typing

// Mock firebase/firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...mod,
    collection: vi.fn(() => ({ type: 'collectionRef', id: 'mockCollection' })),
    doc: vi.fn(() => ({ type: 'docRef', id: 'mockDoc' })),
    addDoc: vi.fn(async (collectionRef, data) => ({
      id: 'new-doc-id',
      get: async () => ({
        exists: true,
        data: () => data,
        id: 'new-doc-id',
      }),
    })),
    getDocs: vi.fn(async (queryRef) => ({
      empty: false,
      docs: [
        {
          id: 'item-id-1',
          data: () => ({ name: 'Nail Polish 1', tags: ['red'] }),
          exists: true,
        },
      ],
    })),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    // Mock other necessary functions as you go
  };
});

// Now import the functions from your firestore.ts to test
import { addNailItem, getNailItems } from '../../lib/firestore';

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addNailItem should call addDoc with correct data', async () => {
    const mockData = { name: 'Test Nail', color: 'blue' };
    const result = await addNailItem(mockData as any); // Cast as any for simplified test setup
    expect(addDoc).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'collectionRef', id: 'mockCollection' }),
      mockData
    );
    expect(result).toEqual(expect.objectContaining({ id: 'new-doc-id' }));
  });

  it('getNailItems should fetch and return nail items', async () => {
    const items = await getNailItems();
    expect(getDocs).toHaveBeenCalled();
    expect(items).toEqual([
      expect.objectContaining({ id: 'item-id-1', name: 'Nail Polish 1' }),
    ]);
  });
});
```
