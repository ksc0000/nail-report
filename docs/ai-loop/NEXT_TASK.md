# Worker Prompt Template

## Context

The current phase (Phase 2) focuses on improving stability, test coverage, and UX. Specifically, Phase 2.1 targets adding unit tests for critical helper functions. This task addresses the need for unit tests in the Firestore module.

## Objective

Add Vitest unit tests for the `addNailItem` and `getNailItems` helper functions within `src/lib/firestore.ts`. These tests should leverage mocking for Firebase SDK dependencies to ensure isolated unit testing.

## Allowed Scope

-   `src/lib/firestore.ts` (minor modifications for export if necessary, no logic changes)
-   `src/__tests__/firestore.test.ts` (new test file)

## Forbidden Scope

-   `src/main.tsx` (entry point — do not modify)
-   `commands/` (PowerShell scripts — do not modify)
-   `firestore.rules`, `storage.rules` (require human approval)
-   `package.json` (no new npm packages, do not modify existing scripts)
-   Firebase deploy commands
-   Secrets and credentials

## Requirements

-   Keep diff ≤ 150 lines.
-   Run `npm run build && npm run lint` before finishing.
-   Ensure tests run successfully using the existing `npm run test` or equivalent command.
-   Use `vi.mock` from Vitest to mock Firebase SDK dependencies (e.g., `firebase/firestore`) to isolate `firestore.ts` functions for testing.

## Output Format

-   Summary of what changed
-   Changed files list
-   Commands run and results
-   Known issues or limitations
-   Suggested next task

## Worker Prompt

Your task is to implement unit tests for two specific functions in `src/lib/firestore.ts`: `addNailItem` and `getNailItems`.

1.  **Create a new test file:** Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK:** Inside `src/__tests__/firestore.test.ts`, use `vi.mock` to mock `firebase/firestore` and any other Firebase SDK dependencies that `addNailItem` and `getNailItems` rely on. This is crucial for isolated unit testing.
    *   You will need to mock functions like `doc`, `collection`, `addDoc`, `getDocs`, `query`, etc., as they would interact with a real Firebase backend.
3.  **Test `addNailItem`:**
    *   Write a test case that verifies `addNailItem` correctly calls the mocked Firebase functions (e.g., `addDoc`) with the expected arguments.
    *   Ensure it handles successful additions and potentially mocked error scenarios.
4.  **Test `getNailItems`:**
    *   Write a test case that verifies `getNailItems` correctly calls the mocked Firebase functions (e.g., `getDocs`, `query`) and processes the returned snapshot data as expected.
    *   Mock an array of `QueryDocumentSnapshot` objects to simulate data retrieval.
5.  **Run Tests:** Execute `npm run test` (or the equivalent test command) to verify your new tests pass.
6.  **Code Quality:** Ensure your code adheres to linting rules (`npm run lint`).

**Example mocking approach (pseudo-code):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi } from 'vitest';
import { addNailItem, getNailItems } from '../lib/firestore'; // Your module

// Mock the firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    collection: vi.fn(() => ({
      // Mock collection reference object
      id: 'mock-collection-id',
    })),
    addDoc: vi.fn(() => Promise.resolve({ id: 'new-doc-id' })),
    getDocs: vi.fn(() => Promise.resolve({
      // Mock QuerySnapshot
      docs: [
        { id: 'item1', data: () => ({ name: 'Nail 1' }) },
        { id: 'item2', data: () => ({ name: 'Nail 2' }) },
      ],
    })),
    // ... mock other necessary functions like query, doc, etc.
  };
});

describe('firestore helpers', () => {
  it('should add a nail item', async () => {
    const userId = 'test-user';
    const itemData = { name: 'Test Nail', type: 'gel' };
    await addNailItem(userId, itemData);
    expect(vi.mocked(require('firebase/firestore').collection)).toHaveBeenCalledWith(
      expect.anything(), // firebase app
      `users/${userId}/nailItems`
    );
    expect(vi.mocked(require('firebase/firestore').addDoc)).toHaveBeenCalledWith(
      expect.any(Object), // mock collection reference
      itemData
    );
  });

  it('should get nail items', async () => {
    const userId = 'test-user';
    const items = await getNailItems(userId);
    expect(vi.mocked(require('firebase/firestore').collection)).toHaveBeenCalledWith(
      expect.anything(),
      `users/${userId}/nailItems`
    );
    expect(vi.mocked(require('firebase/firestore').getDocs)).toHaveBeenCalled();
    expect(items).toEqual([
      { id: 'item1', name: 'Nail 1' },
      { id: 'item2', name: 'Nail 2' },
    ]);
  });
});
```
