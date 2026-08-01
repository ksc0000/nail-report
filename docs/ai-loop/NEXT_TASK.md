# Worker Prompt Template

## Context

The product roadmap for nail-report is in Phase 2, focusing on improving stability, test coverage, and UX. Specifically, Phase 2.1 aims to increase test coverage, starting with core utility functions. This task initiates the process of adding unit tests to the Firebase helper functions.

## Objective

Add unit tests for the `addItem` and `getItem` functions within `src/lib/firestore.ts` using Vitest, mocking the Firebase SDK as needed.

## Allowed Scope

- `src/lib/firestore.ts` (minor adjustments for testability if strictly necessary, but prefer not to modify core logic)
- `src/lib/__tests__/firestore.test.ts` (new file for tests)
- `src/__tests__/` (new test files)
- `vite.config.ts` (if Vitest configuration is missing for these tests, minor additions only)

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

Your task is to implement unit tests for the Firebase Firestore helper functions.

1.  **Create a new test file**: Create `src/lib/__tests__/firestore.test.ts`.
2.  **Test `addItem` function**: Write unit tests for the `addItem` function found in `src/lib/firestore.ts`.
    *   This function is expected to add a new document to a Firestore collection.
    *   Ensure to mock the Firebase Firestore SDK (e.g., `getFirestore`, `collection`, `addDoc`) using `vi.mock` to isolate the function logic from actual Firebase calls.
    *   Verify that `addDoc` is called with the correct collection reference and data.
3.  **Test `getItem` function**: Write unit tests for the `getItem` function in `src/lib/firestore.ts`.
    *   This function is expected to retrieve a single document from a Firestore collection by ID.
    *   Mock the Firebase Firestore SDK (e.g., `doc`, `getDoc`) using `vi.mock`.
    *   Verify that `getDoc` is called with the correct document reference and that the function returns the expected data, handling cases where the document exists or does not exist.
4.  **Run tests**: Ensure all newly written tests pass using `npm run test` (or `vitest`).
5.  **Build and Lint**: Confirm the project builds and lints without errors using `npm run build && npm run lint`.

**Assumptions**:
*   Vitest is already configured in the project (`package.json` devDependencies and `vite.config.ts`) and `npm run test` will execute Vitest tests. Do not add `vitest` or any other new npm dependency.
*   The `src/lib/firestore.ts` file contains `addItem` and `getItem` functions that interact with Firebase Firestore.

**Example `vi.mock` structure (adapt as needed):**

```typescript
// src/lib/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { doc, getDoc, collection, addDoc, getFirestore } from 'firebase/firestore'; // Import necessary Firestore functions

// Mock the entire 'firebase/firestore' module
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore
    collection: vi.fn(() => ({ type: 'collection-ref' })), // Mock collection ref
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })), // Mock addDoc
    doc: vi.fn(() => ({ type: 'doc-ref' })), // Mock doc ref
    getDoc: vi.fn(() => Promise.resolve({
      exists: vi.fn(() => true),
      data: vi.fn(() => ({ /* mock data */ })),
      id: 'mock-doc-id',
    })), // Mock getDoc
    // Add other mocks as needed for deleteDoc, updateDoc, getDocs, etc.
  };
});

describe('Firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('should add an item to Firestore', async () => {
    // Test addItem
  });

  it('should get an item from Firestore', async () => {
    // Test getItem
  });

  // ... more tests
});
```
