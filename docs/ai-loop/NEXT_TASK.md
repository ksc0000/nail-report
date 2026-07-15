# Worker Prompt Template

## Context

The product roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. This task contributes to the "2.1 Test coverage" goal by adding unit tests for core Firebase utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally keep internal functions private if possible)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup is not complete, but prioritize creating the test file first)
- `package.json` (only to add `vitest` or `jsdom` if not already present, and create a `test` script; no new external npm dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new external npm packages beyond `vitest` and `jsdom` if absolutely necessary for testing Firebase SDK, without human approval)
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

---

## Worker prompt

You are an expert React/TypeScript developer. Your task is to add comprehensive unit tests for the functions in `src/lib/firestore.ts` using Vitest.

1.  **Install Vitest (if not already present):** Check `package.json` for `vitest` and `jsdom`. If they are missing, add them as dev dependencies and configure a `test` script, e.g., `"test": "vitest"`. If `vitest.config.ts` is missing, create a basic one.
2.  **Create Test File:** Create a new test file at `src/__tests__/firestore.test.ts`.
3.  **Mock Firebase SDK:**
    *   Since `src/lib/firestore.ts` interacts with Firebase Firestore, you will need to mock the Firebase SDK (`firebase/firestore`). Use `vi.mock` to simulate its behavior, returning mock data or resolving/rejecting promises as needed.
    *   Focus on mocking the Firebase functions called directly by `src/lib/firestore.ts`, such as `collection`, `doc`, `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `orderBy`, `limit`, etc.
    *   Ensure your mocks allow testing both successful operations and error conditions (e.g., simulating a Firestore read/write failure).
4.  **Write Tests for Core Functions:**
    *   Identify all exported helper functions in `src/lib/firestore.ts` (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem`, `getShareLink`, etc.).
    *   For each function, write at least one positive test case (happy path) that verifies its expected behavior when interacting with the mocked Firestore.
    *   Consider edge cases, such as an empty collection or a document not found, where applicable.
    *   Ensure proper assertion of return values and side effects (e.g., if a function calls `addDoc`, verify it was called with the correct arguments).
5.  **Refactor for Testability (if necessary):** If any functions in `src/lib/firestore.ts` are difficult to test due to tightly coupled dependencies or lack of clear return values, make minimal, clean refactorings to improve their testability without altering their external behavior or introducing new bugs.

**Example Mocking Pattern:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreLib from '../lib/firestore'; // Assuming firestore.ts exports functions

// Mock Firebase Firestore
const mockCollection = vi.fn(() => ({
  id: 'mock-collection-id',
  add: vi.fn(),
}));
const mockDoc = vi.fn(() => ({ id: 'mock-doc-id' }));
const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn();
const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
    collection: mockCollection,
    doc: mockDoc,
    getDocs: mockGetDocs,
    getDoc: mockGetDoc,
    addDoc: mockAddDoc,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    query: vi.fn((c, ...q) => ({ queryConstraints: q })), // Basic mock for query
    where: vi.fn((field, op, value) => ({ field, op, value })),
    orderBy: vi.fn((field, direction) => ({ field, direction })),
    limit: vi.fn((l) => ({ limit: l })),
  };
});

describe('firestore.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should fetch nail items correctly', async () => {
    const mockNailItems = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];
    mockGetDocs.mockResolvedValueOnce({
      docs: mockNailItems.map(item => ({
        id: item.id,
        data: () => item,
      })),
    });

    const items = await firestoreLib.getNailItems('mockUserId');
    expect(items).toEqual(mockNailItems);
    expect(mockCollection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
    expect(mockGetDocs).toHaveBeenCalled();
  });

  // Add more tests for addNailItem, updateNailItem, deleteNailItem, etc.
});
```

### Acceptance Criteria

-   A new file `src/__tests__/firestore.test.ts` exists.
-   This test file contains at least one unit test for each exported function in `src/lib/firestore.ts` that interacts with Firestore.
-   Firebase Firestore SDK interactions are mocked using `vi.mock`.
-   All tests pass successfully when `npm run test` is executed.
-   The diff size is ≤ 150 lines.

### Required Test Commands

```bash
npm run test
npm run build
npm run lint
```
