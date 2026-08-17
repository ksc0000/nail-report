```markdown
# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. This task specifically addresses Phase 2.1: Test coverage, by adding unit tests for core Firebase helper functions.

## Objective

Implement unit tests for key helper functions within `src/lib/firestore.ts` using Vitest and mock the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minimal modifications if needed for testability)
- `src/__tests__/` (new test files, e.g., `src/__tests__/lib/firestore.test.ts`)
- `vite.config.ts` (if Vitest setup for mocking is needed, but prefer to keep changes within test files)

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

## Worker prompt

Your task is to add unit tests for the `src/lib/firestore.ts` helper functions.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Mock Firebase SDK**: Implement mocking for the Firebase Firestore SDK using `vi.mock` as described in Vitest documentation for mocking modules. You'll likely need to mock `firebase/firestore`.
    *   Focus on mocking the functions related to `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`, `query`, `where`, `orderBy`, `limit`, and `Timestamp` that are used by `firestore.ts`.
3.  **Write unit tests**: Implement unit tests for at least *two* of the following functions in `src/lib/firestore.ts`:
    *   `addNailItem`
    *   `getNailItems`
    *   `updateNailItem`
    *   `deleteNailItem`
    *   `addPublicShare`
    *   `getPublicShare`
    *   `deletePublicShare`
    Choose functions that allow you to demonstrate effective mocking and test basic CRUD operations.
4.  **Assertions**: Ensure tests use Vitest's assertion library (`expect`) to verify the correct behavior of the functions, including checking if Firebase functions were called with the correct arguments and if the return values are as expected.
5.  **Run tests**: Confirm tests pass by running `npm run test`.
6.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass without errors or warnings.

**Example Mocking Pattern**:

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import {
  addNailItem,
  // ... other functions
} from '../../lib/firestore'; // Adjust path as needed

// Mock firebase/firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({})), // Mock collection
    doc: vi.fn(() => ({})), // Mock doc
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })), // Mock addDoc
    getDoc: vi.fn(() => Promise.resolve({
      exists: vi.fn(() => true),
      data: vi.fn(() => ({ /* mock data */ })),
      id: 'mock-doc-id'
    })),
    getDocs: vi.fn(() => Promise.resolve({
      forEach: vi.fn((cb) => {
        cb({ id: 'doc1', data: () => ({ /* mock data 1 */ }) });
        cb({ id: 'doc2', data: () => ({ /* mock data 2 */ }) });
      }),
      docs: [{ id: 'doc1', data: () => ({ /* mock data 1 */ }) }, { id: 'doc2', data: () => ({ /* mock data 2 */ }) }]
    })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    query: vi.fn(() => ({})),
    where: vi.fn(() => ({})),
    orderBy: vi.fn(() => ({})),
    limit: vi.fn(() => ({})),
    Timestamp: {
      now: vi.fn(() => ({ toDate: () => new Date() })),
      fromDate: vi.fn((date) => ({ toDate: () => date }))
    },
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add a nail item successfully', async () => {
    const itemData = {
      description: 'Test item',
      // ... other fields
    };
    const userId = 'user123';

    await addNailItem(itemData, userId);

    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(), // Firestore instance from collection mock
      expect.objectContaining(itemData)
    );
  });

  // Add more tests for other functions
});
```
