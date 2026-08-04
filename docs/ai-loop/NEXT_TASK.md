```markdown
# Worker Prompt Template

## Context

The application is in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. This task specifically addresses test coverage for core utility functions.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. The goal is to ensure robust, testable code for interacting with Firestore.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but prefer minimal changes)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `vitest.config.ts` (if minor configuration is needed for mocking, but prefer existing setup)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials
- Any files outside the `src/` directory, except for `vitest.config.ts` if strictly necessary.

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file, e.g., `src/__tests__/firestore.test.ts`.
- Mock Firebase SDK dependencies as needed using `vi.mock`.
- Write unit tests for at least two key functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, or similar data manipulation functions).
- Tests should cover typical success cases and basic error handling where applicable.
- Run `npm run build && npm run lint` before finishing.
- Run `npm test` and ensure all new tests pass.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---
**Worker prompt:**

Jules, your task is to implement unit tests for the `src/lib/firestore.ts` file.

1.  **Create a new test file:** In the `src/__tests__/` directory, create `firestore.test.ts`.
2.  **Mock Firebase:** Use `vi.mock` to mock the Firebase Firestore SDK methods that `src/lib/firestore.ts` interacts with. Focus on mocking `getFirestore`, `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, `query`, `orderBy`, etc., as appropriate for the functions you are testing.
3.  **Implement tests:**
    *   Identify at least two core data manipulation functions in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`).
    *   Write `describe` and `it` blocks to test these functions.
    *   For each function, ensure at least one successful execution path is covered.
    *   Consider adding a basic error-case test if the function explicitly handles errors that can be mocked (e.g., Firestore rejection).
4.  **Verify:**
    *   Ensure all new tests pass by running `npm test`.
    *   Check for linting errors with `npm run lint`.
    *   Confirm the project still builds without errors using `npm run build`.

**Example mocking approach:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore';

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({})), // Mock collection reference
    doc: vi.fn(() => ({})), // Mock doc reference
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    getDocs: vi.fn(() => Promise.resolve({
      forEach: (cb) => {
        cb({ id: 'item1', data: () => ({ /* mock data */ }) });
        cb({ id: 'item2', data: () => ({ /* mock data */ }) });
      }
    })),
    query: vi.fn((c, ...q) => ({})),
    orderBy: vi.fn(() => ({})),
  };
});

// Import the actual functions to test
import { addNailItem, getNailItems } from '../lib/firestore'; // Adjust path as needed

describe('Firestore Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should add a new nail item', async () => {
    const mockItem = { name: 'Test Nail Item', userId: 'user123' };
    const result = await addNailItem('user123', mockItem);

    expect(addDoc).toHaveBeenCalledWith(
      expect.any(Object), // Collection reference
      expect.objectContaining(mockItem)
    );
    expect(result).toEqual('mock-id');
  });

  it('should get nail items for a user', async () => {
    const items = await getNailItems('user123');
    expect(getDocs).toHaveBeenCalled();
    expect(items).toHaveLength(2); // Based on mock data above
  });
});
```
```
