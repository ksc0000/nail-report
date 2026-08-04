# Worker Prompt Template

## Context

The product roadmap for nail-report is focused on improving stability, test coverage, and UX in Phase 2. The current state indicates that test coverage is a priority. This task will initiate unit testing for the core Firebase helper functions.

## Objective

Add Vitest unit tests for initial helper functions in `src/lib/firestore.ts`.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications if necessary for testability)
-   `src/__tests__/firestore.test.ts` (new file for tests)
-   `vite.config.ts` (only if necessary for Vitest setup, e.g., adding `test` config, but prefer to assume it's already configured for basic unit tests)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials
-   `src/App.css` or any other UI-related CSS files.

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Focus on testing 1-2 simple, isolated helper functions from `src/lib/firestore.ts`. Good candidates are `getNailItem` or `createNailItem` if they exist and are straightforward.
-   Use `vitest` and `vi.mock` to mock Firebase SDK dependencies (e.g., `firebase/firestore`).
-   Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
-   Ensure tests are meaningful and cover basic success cases for the chosen functions.
-   Report follow-up items as comments, not additional code.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

---

## Worker prompt

You are an AI assistant. Your task is to add Vitest unit tests for selected helper functions in `src/lib/firestore.ts` for the `nail-report` application.

Here are the detailed steps:

1.  **Create Test File**: Create a new file `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore**: Inside `src/__tests__/firestore.test.ts`, use `vi.mock('firebase/firestore');` to mock the Firebase Firestore SDK. Provide mock implementations for functions like `getDoc`, `setDoc`, `addDoc`, `collection`, `doc`, etc., as needed by the functions you are testing.
3.  **Select Functions to Test**: Identify 1-2 *simple and isolated* helper functions within `src/lib/firestore.ts` that interact with Firestore. For example, `getNailItem` or `createNailItem` (if they exist).
4.  **Write Unit Tests**: For each selected function:
    *   Write a `describe` block for `src/lib/firestore.ts`.
    *   Write one or more `test` blocks to cover basic success scenarios.
    *   Ensure the tests assert the expected behavior and interaction with the mocked Firestore.
5.  **Refine `firestore.ts` (if necessary)**: Make *minimal* changes to `src/lib/firestore.ts` if a function is impossible to test without minor refactoring for dependency injection (e.g., passing a Firestore instance), but avoid significant architectural changes. Prefer to test the existing implementation by mocking its dependencies.
6.  **Run Checks**: Execute `npm run build` and `npm run lint` to ensure no new errors are introduced.
7.  **Run Tests**: Execute `npm test` or `vitest` to confirm your new tests pass.

**Example Mocking Pattern**:

```typescript
// src/__tests__/firestore.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the firebase/firestore module
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockCollection = vi.fn(() => ({ id: 'mockCollectionRef' })); // Mock a collection reference
const mockDoc = vi.fn(() => ({ id: 'mockDocRef' })); // Mock a document reference
const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockGetDocs = vi.fn();

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getDoc: mockGetDoc,
    setDoc: mockSetDoc,
    collection: mockCollection,
    doc: mockDoc,
    addDoc: mockAddDoc,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    query: mockQuery,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    getDocs: mockGetDocs,
    // Add other Firestore functions used in firestore.ts as needed
  };
});

// Import the module under test AFTER mocking firebase/firestore
import { getNailItem, createNailItem } from '../lib/firestore'; // Adjust path as necessary

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should fetch a nail item successfully', async () => {
    // Implement test for getNailItem
    // Example:
    const mockNailItemData = { id: 'testId', name: 'Test Nail', date: '2023-01-01' };
    mockDoc.mockReturnValueOnce('mockDocRef');
    mockGetDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockNailItemData,
      id: 'testId',
    });

    const result = await getNailItem('userId', 'testId');
    expect(result).toEqual({ ...mockNailItemData, id: 'testId' });
    expect(mockCollection).toHaveBeenCalledWith(expect.any(Object), 'users', 'userId', 'nailItems');
    expect(mockDoc).toHaveBeenCalledWith('mockCollectionRef', 'testId');
    expect(mockGetDoc).toHaveBeenCalledWith('mockDocRef');
  });

  it('should create a new nail item successfully', async () => {
    // Implement test for createNailItem
    // Example:
    const newItem = { name: 'New Nail', date: '2023-02-01' };
    mockCollection.mockReturnValueOnce('mockCollectionRef');
    mockAddDoc.mockResolvedValueOnce({ id: 'newTestId' });

    const result = await createNailItem('userId', newItem);
    expect(result).toEqual({ id: 'newTestId', ...newItem });
    expect(mockCollection).toHaveBeenCalledWith(expect.any(Object), 'users', 'userId', 'nailItems');
    expect(mockAddDoc).toHaveBeenCalledWith('mockCollectionRef', newItem);
  });

  // Add more tests for other functions or error cases
});
```
