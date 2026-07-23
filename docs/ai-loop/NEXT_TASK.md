# Worker Prompt Template

## Context

The current development phase is 2.0, focusing on improving stability, test coverage, and UX. This task contributes to "2.1 Test coverage" by adding unit tests for core Firebase Firestore helper functions.

## Objective

Implement unit tests for selected functions within `src/lib/firestore.ts` using Vitest and mock the Firebase Firestore SDK.

## Allowed Scope

-   `src/lib/firestore.ts` (minor changes for testability, if necessary)
-   `src/__tests__/firestore.test.ts` (new file for unit tests)
-   `vite.config.ts` (only if Vitest setup is missing or requires minor adjustments for testing `src/lib` files; prefer to avoid if possible)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` deps (no new npm packages without human approval)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Add tests for at least two key functions in `src/lib/firestore.ts`, such as `addNailItem` and `getNailItems`.
-   Utilize `vi.mock('firebase/firestore')` to mock Firebase Firestore SDK functions like `collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, and `deleteDoc`.
-   Ensure tests assert correct function calls and data manipulation without actual Firebase interactions.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to add unit tests for the `src/lib/firestore.ts` file.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore SDK**: In `src/__tests__/firestore.test.ts`, use `vi.mock('firebase/firestore')` to mock the necessary Firestore functions (`collection`, `addDoc`, `getDocs`, `doc`, `updateDoc`, `deleteDoc`, etc.) to isolate your tests from actual Firebase calls.
3.  **Test `addNailItem`**: Write a test case for the `addNailItem` function that asserts `addDoc` is called with the correct `collection` reference and item data.
4.  **Test `getNailItems`**: Write a test case for the `getNailItems` function that asserts `getDocs` is called with the correct `collection` reference and that the function correctly transforms and returns the mocked Firestore document data.
5.  **Run tests**: Verify your new tests pass using `npm test`.
6.  **Lint and Build**: Ensure `npm run lint` and `npm run build` pass.

**Example for mocking `addDoc`**:

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Import only what's needed

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...mod,
    collection: vi.fn(() => ({ type: 'collectionRef' })), // Mock a collection ref
    addDoc: vi.fn((colRef, data) => Promise.resolve({ id: 'testId', colRef, data })),
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
        { id: 'item1', data: () => ({ name: 'Test Nail Item 1' }) },
        { id: 'item2', data: () => ({ name: 'Test Nail Item 2' }) },
      ]
    })),
    // Mock other functions as needed
  };
});

// Assuming your firestore.ts exports functions like this
import { addNailItem, getNailItems } from '../lib/firestore'; // Adjust path if needed

describe('firestore helpers', () => {
  it('should add a nail item', async () => {
    const itemData = { name: 'New Nail Color', description: 'Shiny red' };
    await addNailItem('userId123', itemData);

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'users/userId123/nailItems');
    expect(addDoc).toHaveBeenCalledWith(expect.any(Object), itemData);
  });

  it('should get nail items', async () => {
    const items = await getNailItems('userId123');
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'users/userId123/nailItems');
    expect(getDocs).toHaveBeenCalled();
    expect(items).toEqual([
      { id: 'item1', name: 'Test Nail Item 1' },
      { id: 'item2', name: 'Test Nail Item 2' },
    ]);
  });
});
```
