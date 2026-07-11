# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. A key area is "2.1 Test coverage", specifically adding unit tests for Firebase helper functions. This task directly addresses the goal of improving code reliability and maintainability by adding foundational tests for the Firestore utility functions.

## Objective

Implement unit tests for the helper functions within `src/lib/firestore.ts` using Vitest, ensuring proper mocking of the Firebase SDK.

## Allowed Scope

- `src/lib/firestore.ts` (for minor adjustments to enable testability if necessary, but focus on testing existing logic)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vitest.config.ts` (for minor test configuration if absolutely required, but assume Vitest is mostly set up)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; assume Vitest is already a dev dependency)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Add unit tests for at least two core helper functions from `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `getNailItems`, `deleteNailItem`).
- Ensure the Firebase SDK (Firestore specifically) is mocked appropriately to isolate the `firestore.ts` logic from actual Firebase calls.
- Use `vitest` for the tests.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

### Worker prompt

Jules,

Your task is to add unit tests for the helper functions found in `src/lib/firestore.ts`.

1.  **Create a new test file:** In `src/__tests__`, create `firestore.test.ts`.
2.  **Mock Firebase SDK:** Use `vi.mock` to mock Firebase Firestore functions (e.g., `doc`, `collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`) to simulate their behavior without making actual network calls. Focus on mocking the lowest-level Firebase functions called by `src/lib/firestore.ts`.
3.  **Write tests for `src/lib/firestore.ts`:**
    *   Identify at least two key helper functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `updateNailItem`, `getNailItems`, `deleteNailItem`, `getNailItem`, `getNailItemsCount`).
    *   Write `describe` blocks and `it` tests for these functions, asserting their correct behavior under various conditions (e.g., successful operations, error handling).
    *   Ensure your mocks provide the necessary return values for your `firestore.ts` functions to execute properly.
4.  **Run tests:** Execute `npm test` to verify your tests pass.
5.  **Lint and Build:** Before concluding, run `npm run lint` and `npm run build` to ensure no new errors are introduced.

Focus on testing the *logic* within `firestore.ts`, assuming the mocked Firebase functions behave as expected. Keep the test coverage focused and concise to fit within the diff limit.

**Example of mocking Firestore:**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore if used
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    getDocs: vi.fn(() => Promise.resolve({
      forEach: vi.fn((callback) => { /* mock snapshot data here */ }),
      empty: false,
      docs: [
        { id: 'item1', data: () => ({ name: 'Nail 1' }) },
        { id: 'item2', data: () => ({ name: 'Nail 2' }) },
      ]
    })),
    // ... mock other functions as needed
  };
});

// Import the functions you want to test from firestore.ts
import { addNailItem, getNailItems } from '../lib/firestore';

describe('firestore helpers', () => {
  it('should add a nail item', async () => {
    const itemData = { title: 'New Nail', imageUrl: 'url', tags: ['tag'] };
    const result = await addNailItem('user123', itemData);
    expect(addDoc).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ id: 'mock-id' }));
  });

  it('should get nail items', async () => {
    const items = await getNailItems('user123');
    expect(getDocs).toHaveBeenCalled();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe('item1');
  });
});
```
