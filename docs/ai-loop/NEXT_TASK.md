```markdown
# Worker Prompt Template

## Context

The current phase focuses on improving stability, test coverage, and UX. This task initiates the test coverage efforts by adding unit tests for core helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications only if necessary for testability, e.g., exporting unexported functions, but prefer minimal changes)
- `src/__tests__/lib/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (if Vitest setup is needed, but prefer to assume it's already set up for basic usage)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/lib/firestore.test.ts`.
- Add unit tests for at least one function in `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, `getPublicShare`).
- Mock Firebase SDK dependencies as needed using `vi.mock` to ensure tests are isolated unit tests.
- Ensure tests cover basic success cases and ideally one error case if simple to implement.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

## Worker Prompt

Your task is to add unit tests for the helper functions in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/lib/firestore.test.ts`.
2.  **Set up Vitest mocking**: Use `vi.mock` to mock the Firebase Firestore SDK (e.g., `firebase/firestore`) to prevent actual database calls during tests. Focus on mocking the methods that `src/lib/firestore.ts` calls (e.g., `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).
3.  **Write unit tests**: Implement unit tests for at least one of the exported functions in `src/lib/firestore.ts`. For example, focus on testing `addNailItem` or `getNailItems`.
    *   Test successful scenarios (e.g., `addNailItem` correctly calls `addDoc` with the provided data).
    *   Consider a basic error scenario if easy to mock (e.g., a mock `addDoc` throwing an error).
4.  **Verify test execution**: Ensure the new tests run successfully using `npm run test` or `vitest`.
5.  **Lint and build**: Run `npm run lint` and `npm run build` to ensure no new errors are introduced.

**Example Mocking Pattern (adapt as needed):**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'; // Import only for type knowledge or specific mocks

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
    collection: vi.fn(() => ({ id: 'mockCollectionRef' })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'newMockDocId' })),
    getDocs: vi.fn(() => Promise.resolve({ empty: false, docs: [{ id: 'mockDoc1', data: () => ({ name: 'Test Nail' }) }] })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    doc: vi.fn((db, path, id) => ({ path, id })), // Mock doc if used for specific document references
  };
});

// Import the function to be tested *after* mocking
import { addNailItem, getNailItems } from '../../src/lib/firestore';

describe('firestore helpers', () => {
  it('addNailItem should correctly add a nail item', async () => {
    const mockNailItem = { name: 'New Polish', tags: [], imageUrl: '' };
    const result = await addNailItem('userId123', mockNailItem);
    expect(addDoc).toHaveBeenCalledWith(
      expect.any(Object), // Mocked collection reference
      expect.objectContaining(mockNailItem)
    );
    expect(result).toBe('newMockDocId');
  });

  // Add more tests for getNailItems, updateNailItem, deleteNailItem, etc.
});
```
```
