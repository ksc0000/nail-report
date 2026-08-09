# Worker Prompt Template

## Context

The application is in Phase 2, focusing on improving stability, test coverage, and UX. This task addresses the "2.1 Test coverage" goal by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for selected helper functions in `src/lib/firestore.ts` using Vitest, focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if necessary, but prefer not)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `package.json` (only to add `vitest` scripts if not already present, but the roadmap implies Vitest is already chosen, so likely no new deps)
- `vite.config.ts` (for Vitest configuration, if needed)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, beyond existing Vitest setup)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Prefer adding tests when touching `src/lib/` files.
- Report follow-up items as comments, not additional code.
- Ensure Firebase SDK calls (e.g., `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`) are properly mocked.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` file.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Set up Vitest and Firebase Mocking**:
    *   Use `vi.mock` to mock Firebase client SDK modules (`firebase/firestore`, `firebase/auth`, etc.) as needed. The goal is to test `firestore.ts` logic in isolation, without actual Firebase calls.
    *   Mock Firestore functions like `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc` to return predictable data or resolve/reject promises as per the test scenario.
3.  **Write Unit Tests**:
    *   Focus on adding tests for the following key functions in `src/lib/firestore.ts`:
        *   `addNailItem`: Test successful addition.
        *   `getNailItems`: Test successful retrieval of a list of items.
    *   For each function, consider at least one successful case. If time and line budget allow, add one error handling case (e.g., `addDoc` throws an error).
4.  **Ensure Test Isolation**: Tests should not rely on a live Firebase project.
5.  **Run Checks**: Before completing, ensure `npm run test`, `npm run build`, and `npm run lint` pass.

**Example Mocking Pattern (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { addNailItem, getNailItems } from '../lib/firestore'; // The functions to test

// Mock Firebase Firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({ type: 'collection-ref' })), // Mock collection
    doc: vi.fn(() => ({ type: 'doc-ref' })), // Mock doc
    addDoc: vi.fn(async () => ({ id: 'new-id-123', get: async () => ({ id: 'new-id-123', data: () => ({ /* mock item data */ }) }) })),
    getDocs: vi.fn(async () => ({
      empty: false,
      docs: [
        { id: 'item-1', data: () => ({ name: 'Test Item 1' }) },
        { id: 'item-2', data: () => ({ name: 'Test Item 2' }) },
      ],
    })),
    // ... mock other functions as needed
    query: vi.fn((c, ...constraints) => ({ type: 'query-ref', collection: c, constraints })),
    where: vi.fn((field, op, value) => ({ type: 'where', field, op, value })),
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('addNailItem should add a new item to firestore', async () => {
    const mockItem = { name: 'New Polish', tags: ['red'], imageUrl: 'url', userId: 'user123' };
    const result = await addNailItem(mockItem);

    expect(addDoc).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'collection-ref' }),
      expect.objectContaining(mockItem)
    );
    expect(result.id).toBe('new-id-123');
  });

  it('getNailItems should retrieve items for a given user', async () => {
    const userId = 'user123';
    const items = await getNailItems(userId);

    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'collection-ref' }),
      expect.objectContaining({ type: 'where', field: 'userId', op: '==', value: userId })
    );
    expect(getDocs).toHaveBeenCalled();
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Test Item 1');
  });

  // Add more tests for other functions or error cases
});
```
