# Worker Prompt Template

## Context

The product roadmap prioritizes improving stability and test coverage in Phase 2.1. This task focuses on establishing unit tests for core Firestore helper functions, which are critical for the application's data management. Adding tests for `src/lib/firestore.ts` will lay the groundwork for a more robust and maintainable codebase, directly addressing the "Test coverage" objective.

## Objective

Implement Vitest unit tests for the `addNailItem` and `getNailItems` functions within `src/lib/firestore.ts`. This task involves setting up the necessary testing infrastructure if not already present and writing tests that mock Firebase SDK interactions.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions for testing, if necessary, or minor fixes)
- `src/__tests__/lib/firestore.test.ts` (new file for unit tests)
- `vite.config.ts` (if Vitest setup is required)
- `package.json` (only for adding `vitest` script if needed, *not* new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval, except for adding `vitest` if absolutely necessary for initial setup, but prefer to assume `vitest` is already installed as per roadmap)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Keep diff ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.
- Create `src/__tests__/lib/firestore.test.ts`.
- Write unit tests for `addNailItem` and `getNailItems` functions in `src/lib/firestore.ts`.
- Ensure tests effectively mock Firebase SDK functions (`addDoc`, `getDocs`, `collection`, etc.) to prevent actual interaction with Firebase.
- Verify that tests run successfully using `npm run test` (or equivalent Vitest command).

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task

---

## Worker prompt

Your task is to add Vitest unit tests for two key Firestore helper functions: `addNailItem` and `getNailItems`, located in `src/lib/firestore.ts`.

1.  **Vitest Setup (if necessary):**
    *   Verify if `vitest` is already configured in `vite.config.ts`. If not, add a basic Vitest configuration to `vite.config.ts` (e.g., defining `test` object with `environment: 'jsdom'`).
    *   Ensure a test script (e.g., `"test": "vitest"`) exists in `package.json`. If not, add it. *Do not add `vitest` as a new dependency to `package.json`; assume it's already installed as per the roadmap.*

2.  **Create Test File:**
    *   Create a new file: `src/__tests__/lib/firestore.test.ts`.

3.  **Mock Firebase SDK:**
    *   Inside `src/__tests__/lib/firestore.test.ts`, use `vi.mock` to mock the `firebase/firestore` module. This is crucial to prevent tests from hitting actual Firebase services.
    *   For `addNailItem`, mock `addDoc` to return a mock `DocumentReference`.
    *   For `getNailItems`, mock `getDocs` to return a mock `QuerySnapshot` containing mock `QueryDocumentSnapshot` objects. You will also need to mock `collection`.

4.  **Write Unit Tests:**
    *   **`addNailItem`:**
        *   Test that `addNailItem` calls `addDoc` with the correct `collection` and item data.
        *   Test that it returns the expected mock result.
    *   **`getNailItems`:**
        *   Test that `getNailItems` calls `getDocs` with the correct `collection`.
        *   Test that it correctly maps the mock `QuerySnapshot` into an array of objects with `id` and data.

5.  **Run Tests and Linting:**
    *   Run `npm run test` to verify your new tests pass.
    *   Run `npm run build && npm run lint` to ensure no build or linting errors are introduced.

**Example structure for mocking `firebase/firestore`:**

```typescript
// src/__tests__/lib/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestoreModule from 'firebase/firestore'; // Import everything for mocking

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // Keep original exports that are not mocked
    collection: vi.fn(() => ({ id: 'mockCollectionRef' })), // Mock collection
    addDoc: vi.fn(() => Promise.resolve({ id: 'mockDocId' })), // Mock addDoc
    getDocs: vi.fn(() => Promise.resolve({
      docs: [
        { id: 'item1', data: () => ({ name: 'Item 1' }) },
        { id: 'item2', data: () => ({ name: 'Item 2' }) },
      ],
      empty: false,
    })),
    // Mock other functions as needed for future tests
  };
});

// Assuming db is imported from somewhere like './firebase'
// You might also need to mock the `db` instance if it's coming from an unmocked file
// Or ensure `src/lib/firestore.ts` exports functions that take `db` as an argument for easier testing.
// For this task, assume `db` itself is not the direct target of mocking, but rather the SDK functions.

import { addNailItem, getNailItems } from '../lib/firestore'; // Adjust path as needed

describe('firestore helpers', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('addNailItem should call addDoc with correct data', async () => {
    const mockItem = { polishName: 'Test Polish', date: '2023-01-01' };
    await addNailItem(mockItem);

    expect(firestoreModule.collection).toHaveBeenCalledWith(expect.anything(), 'nailItems');
    expect(firestoreModule.addDoc).toHaveBeenCalledWith(expect.any(Object), mockItem);
  });

  it('getNailItems should fetch and map documents correctly', async () => {
    const items = await getNailItems();

    expect(firestoreModule.collection).toHaveBeenCalledWith(expect.anything(), 'nailItems');
    expect(firestoreModule.getDocs).toHaveBeenCalledWith(expect.any(Object));
    expect(items).toEqual([
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' },
    ]);
  });
});
```
