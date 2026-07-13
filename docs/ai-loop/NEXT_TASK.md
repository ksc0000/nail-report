# Worker Prompt Template

## Context

Read the roadmap, recent commits, and the current task.

## Objective

Add Vitest unit tests for the helper functions within `src/lib/firestore.ts`. This addresses the "2.1 Test coverage" goal of the roadmap.

## Allowed Scope

- `src/lib/firestore.ts` (minor modifications for testability if strictly necessary, e.g., exporting unexported functions if private helper functions are tested directly, but prefer testing public API).
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`).

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

## Worker prompt

### Task: Implement Unit Tests for `src/lib/firestore.ts`

**Detailed Instructions:**

1.  **Create a New Test File:** Create a new test file, for example, `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` from Vitest to mock Firebase SDK dependencies (e.g., `firebase/firestore` or `firebase/app`) as needed for isolated testing of the `firestore.ts` helpers. Ensure that you mock the Firestore functions (e.g., `collection`, `query`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to return predictable values or to assert on their calls.
3.  **Write Unit Tests:** Implement unit tests for at least one or two core helper functions within `src/lib/firestore.ts`. Good candidates include `getNailItems`, `addNailItem`, `updateNailItem`, or `deleteNailItem`.
4.  **Assertions:** Use Vitest's assertion library (`expect`) to verify the correct behavior of the functions under various conditions (e.g., successful data retrieval, correct data transformation, error handling if applicable).
5.  **Run Tests:** Ensure all new and existing tests pass by running `npm run test`.
6.  **Lint and Build:** Verify the project still builds and passes linting checks: `npm run build && npm run lint`.

**Acceptance Criteria:**

*   A new test file (`src/__tests__/firestore.test.ts` or similar) is created.
*   At least one helper function from `src/lib/firestore.ts` (e.g., `getNailItems` or `addNailItem`) has comprehensive unit tests.
*   Firebase SDK modules and functions are properly mocked.
*   `npm run test` passes without errors.
*   The overall diff size is minimal and within the 150-line limit.
*   No new npm dependencies are introduced.

**Example Mocking Pattern (Guidance):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Import only what's needed to mock
import { getNailItems, addNailItem, updateNailItem, deleteNailItem } from '../lib/firestore'; // Your actual functions

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    // Mock other Firestore functions used in your helpers as needed
  };
});

describe('firestore helpers', () => {
  const mockDb = {} as any; // Mock Firebase App/db instance if your helpers take it

  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should fetch nail items correctly', async () => {
    // Arrange
    const mockNailItems = [{ id: '1', name: 'Polish 1' }];
    (collection as vi.Mock).mockReturnValue({}); // Or a more specific mock collectionRef
    (getDocs as vi.Mock).mockResolvedValue({
      docs: mockNailItems.map(item => ({
        id: item.id,
        data: () => item,
        exists: true,
      })),
    });

    // Act
    const result = await getNailItems(mockDb, 'userId');

    // Assert
    expect(collection).toHaveBeenCalledWith(mockDb, 'users/userId/nailItems');
    expect(getDocs).toHaveBeenCalled();
    expect(result).toEqual(mockNailItems);
  });

  // Add more tests for addNailItem, updateNailItem, deleteNailItem etc.
});
```
