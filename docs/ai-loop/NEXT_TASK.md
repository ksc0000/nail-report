# Worker Prompt Template

## Context

The `nail-report` application is currently in Phase 2 of its roadmap, focusing on improving stability, test coverage, and UX. The current iteration is focused on test coverage, specifically adding unit tests for Firebase helper functions. Vitest is the chosen test runner. This task is the first substantive step towards achieving comprehensive test coverage for the core `lib` functions.

## Objective

Implement exactly one bounded task from Phase 2.1 of the roadmap: Add Vitest unit tests for the `addNailItem` helper function in `src/lib/firestore.ts`. This involves setting up appropriate mocks for the Firebase Firestore SDK.

## Allowed Scope

- `src/lib/firestore.ts` (minor changes if needed for testability, but primarily for understanding)
- `src/__tests__/firestore.test.ts` (new file for tests)
- `vite.config.ts` (if minor Vitest configuration adjustments are needed, e.g., to include test files)
- `src/App.css` (No changes expected for this task)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval; Vitest is assumed to be installed as per roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Create a new test file `src/__tests__/firestore.test.ts`.
- Add unit tests for the `addNailItem` function in `src/lib/firestore.ts`.
- Mock Firebase Firestore SDK methods (e.g., `addDoc`, `collection`) using `vi.mock` to isolate the function under test from actual Firebase calls.
- Ensure the test asserts that `addDoc` is called with the correct collection and data.
- Run `npm run build && npm run lint` before finishing.
- Run `npm run test` to ensure tests pass.
- Report follow-up items as comments, not additional code.

## Worker prompt

Jules, your task is to add a unit test for the `addNailItem` function located in `src/lib/firestore.ts`.

Here are the detailed steps:

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase Firestore**: Inside `firestore.test.ts`, use `vi.mock` to mock the `firebase/firestore` module. This mock should provide mock implementations for `collection` and `addDoc`.
    *   `collection` should return a mock collection reference.
    *   `addDoc` should be a mock function (e.g., `vi.fn()`) that resolves successfully.
3.  **Write a test suite**: Define a test suite using `describe` for `src/lib/firestore.ts`.
4.  **Write a test case for `addNailItem`**:
    *   Use `test` or `it` to define a test case named, for example, "should successfully add a nail item".
    *   Inside the test, call the `addNailItem` function with some sample data.
    *   Assert that `collection` and `addDoc` were called with the expected arguments (e.g., the correct Firestore instance, collection path, and nail item data).
    *   Ensure the function under test correctly handles the return value or side effects of `addDoc`.
5.  **Run tests**: Execute `npm run test` to verify your tests pass.
6.  **Lint and Build**: Run `npm run build && npm run lint` to ensure code quality and no build errors.

## Example Mock Structure Hint (adapt as needed):

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addNailItem } from '../lib/firestore'; // Path to your function

// Mock Firebase Firestore
const mockAddDoc = vi.fn();
const mockCollection = vi.fn(() => ({
  id: 'mock-collection-ref'
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    collection: mockCollection,
    addDoc: mockAddDoc,
  };
});

describe('firestore helpers', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAddDoc.mockClear();
    mockCollection.mockClear();
  });

  it('should successfully add a nail item', async () => {
    // Arrange
    const mockNailItemData = {
      name: 'Test Nail Polish',
      brand: 'Test Brand',
      shade: 'Red',
      tags: ['red', 'glossy'],
      createdAt: new Date(),
      imageUrl: 'http://example.com/image.jpg',
      userId: 'test-user-id'
    };
    mockAddDoc.mockResolvedValueOnce({ id: 'new-doc-id' }); // Simulate successful addDoc

    // Act
    const result = await addNailItem(mockNailItemData);

    // Assert
    expect(mockCollection).toHaveBeenCalledWith(expect.any(Object), 'nailItems');
    expect(mockAddDoc).toHaveBeenCalledWith(expect.any(Object), mockNailItemData); // The first arg should be the collection ref returned by mockCollection
    expect(result).toEqual({ id: 'new-doc-id' });
  });

  // Add tests for error cases if addNailItem handles them
});
```
