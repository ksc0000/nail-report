# Worker Prompt Template

## Context

The product roadmap for `nail-report` outlines several phases, with Phase 2 currently active, focusing on improving stability, test coverage, and UX. One of the key objectives in Phase 2.1 is to add unit tests for Firebase helper functions using Vitest. The current state indicates that no specific functional tasks have been completed in this phase yet, and the AI Loop is ready to pick its first substantive task.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, specifically focusing on mocking Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (minor refactoring to improve testability, if necessary, but focus is on testing)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only for verifying `test` script, no new dependencies)
- `vite.config.ts` (only for verifying Vitest configuration, no modifications unless absolutely necessary for test execution)

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
- Create `src/__tests__/firestore.test.ts` for the unit tests.
- Use `vitest` for the test runner and assertions.
- Mock the Firebase SDK (`firebase/firestore`) to isolate `src/lib/firestore.ts` functions.
- Focus on testing the core CRUD operations (e.g., `getNailItems`, `addNailItem`, `updateNailItem`, `deleteNailItem` or similar functions present in `src/lib/firestore.ts`).
- Include tests for successful operations and basic error handling scenarios.
- The task does *not* include installing Vitest or configuring `vite.config.ts` for Vitest, it assumes Vitest is already set up to run tests.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker Prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Utilize `vi.mock('firebase/firestore', ...)` to mock the Firestore SDK functions (e.g., `collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `query`, `where`, etc.) that are used within `src/lib/firestore.ts`. This will allow you to test your helper functions in isolation without actual Firebase calls.
3.  **Identify and Test Core Functions**: Review `src/lib/firestore.ts` and identify the primary functions responsible for interacting with the `nailItems` collection (e.g., fetching, adding, updating, deleting nail items). Write at least one test case for each of these core functions.
4.  **Test Scenarios**:
    *   **Success paths**: Verify that functions correctly process data and call the mocked Firestore methods with the expected arguments.
    *   **Error paths**: Include basic tests to ensure functions handle and potentially re-throw errors when the mocked Firestore methods fail.
5.  **Clean up**: Ensure that mocks are reset between tests (e.g., using `beforeEach` or `afterEach` if needed).
6.  **Verify**: Run `npm run test` (or `vitest` directly if available) to ensure tests pass. Then run `npm run build && npm run lint` to confirm build and linting.

**Example of mocking pattern (adapt as needed for specific Firestore functions):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'; // Import real methods for typing mocks

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', () => {
  const mockDocs = [{ id: '1', data: () => ({ name: 'Test Nail Item 1' }) }];
  return {
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    addDoc: vi.fn(() => Promise.resolve({ id: 'new-id' })),
    getDocs: vi.fn(() => Promise.resolve({
      docs: mockDocs,
      empty: false,
      forEach: (callback) => mockDocs.forEach(callback)
    })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    query: vi.fn(() => ({})),
    where: vi.fn(() => ({})),
    // Add other Firestore functions as needed
  };
});

// Import the functions you want to test from your actual lib file
import { getNailItems, addNailItem } from '../lib/firestore'; // Adjust path as necessary

describe('firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should fetch nail items correctly', async () => {
    const items = await getNailItems('someUserId');
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'nailItems');
    expect(getDocs).toHaveBeenCalled();
    expect(items).toEqual([{ id: '1', name: 'Test Nail Item 1' }]);
  });

  it('should add a nail item', async () => {
    const newItem = { name: 'New Item', userId: 'someUserId' };
    const id = await addNailItem(newItem);
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), newItem);
    expect(id).toBe('new-id');
  });

  // Add more tests for update, delete, and error cases
});
```
