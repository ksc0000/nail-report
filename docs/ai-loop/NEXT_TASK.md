# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on stability, test coverage, and UX improvements. This task specifically addresses Phase 2.1: Test coverage. The goal is to improve the robustness of our data handling logic by adding unit tests for core Firebase Firestore interactions.

## Objective

Implement unit tests for the helper functions located in `src/lib/firestore.ts` using Vitest. The initial focus should be on functions responsible for CRUD operations related to `nailItems` and `publicShares`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but focus on testing)
- `src/__tests__/` (creation of a new test file, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (minor adjustments for test setup if absolutely necessary for mocking)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file (e.g., `src/__tests__/firestore.test.ts`).
- Focus on testing at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `addPublicShare`, `getPublicShare`).
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
- Ensure tests cover basic success cases.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the helper functions within `src/lib/firestore.ts`.

1.  **Create a new test file**: Add `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Set up Vitest to mock the `firebase/firestore` module and any other Firebase services `firestore.ts` interacts with, as suggested in the roadmap for `vi.mock`. You will likely need to mock `getFirestore`, `collection`, `doc`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`, `query`, `where`, etc.
3.  **Implement tests**: Write at least two unit tests for distinct functions in `src/lib/firestore.ts`. Good candidates are:
    *   `addNailItem`: Test if a new nail item can be successfully added.
    *   `getNailItems`: Test if nail items can be retrieved, possibly with a mock list.
    *   `addPublicShare` or `getPublicShare`: Test basic functionality for public shares.
4.  **Assertions**: Use Vitest's assertion library (`expect`) to verify the expected behavior and interactions with the mocked Firebase SDK.
5.  **Run tests**: Confirm your new tests pass by running `npm test`.
6.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass without errors or warnings.

**Example structure for mocking (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Assuming functions are exported
import {
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where
} from 'firebase/firestore'; // Import types for mocking

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', () => {
  const mockDocs: any[] = [];
  return {
    getFirestore: vi.fn(() => ({})), // Mock getFirestore call
    collection: vi.fn((db, path) => ({ db, path })),
    doc: vi.fn((_db, _collectionPath, id) => ({ id })),
    addDoc: vi.fn((colRef, data) => Promise.resolve({ id: 'new-id', ...data })),
    getDocs: vi.fn((q) => Promise.resolve({
      docs: mockDocs.map(data => ({ id: data.id, data: () => data, exists: true }))
    })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    query: vi.fn((colRef, ...constraints) => ({ colRef, constraints })),
    where: vi.fn((field, op, value) => ({ field, op, value })),
    // Add other Firebase Firestore functions as needed for your tests
  };
});

// Cast the mocked functions for type safety in tests
const mockAddDoc = addDoc as vi.Mock;
const mockGetDocs = getDocs as vi.Mock;
const mockCollection = collection as vi.Mock;
const mockQuery = query as vi.Mock;
const mockWhere = where as vi.Mock;

describe('firestoreLib', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should add a new nail item successfully', async () => {
    const mockNailItem = { userId: 'user123', name: 'Test Nail Item' };
    await firestoreLib.addNailItem(mockNailItem);
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'nailItems');
    expect(mockAddDoc).toHaveBeenCalledWith(expect.any(Object), mockNailItem);
  });

  // Add more tests for other functions
});
```
