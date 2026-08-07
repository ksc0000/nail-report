# Worker Prompt Template

## Context

The project is in Phase 2, focusing on improving stability, test coverage, and UX. A key objective for this phase is to increase test coverage for core utility functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to add export, if needed, but primarily for testing existing functionality)
- `src/__tests__/` (new test files, e.g., `src/__tests__/firestore.test.ts`)
- `package.json` (only if Vitest scripts need minor adjustments, *not* for adding new dependencies)
- `vite.config.ts` (minor adjustments for test setup, if necessary)

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

Your task is to add comprehensive unit tests for the Firebase Firestore helper functions located in `src/lib/firestore.ts`.

1.  **Create a new test file**: Create `src/__tests__/firestore.test.ts`.
2.  **Mock Firebase SDK**: Use Vitest's mocking capabilities (`vi.mock`) to mock the Firebase Firestore SDK functions (e.g., `getFirestore`, `collection`, `doc`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`). Ensure your mocks are robust enough to test the interactions with Firestore without making actual network calls.
3.  **Test helper functions**:
    *   Identify the public-facing helper functions in `src/lib/firestore.ts` that interact with Firestore (e.g., functions for CRUD operations on `nailItems`, tag management, or public share link operations).
    *   Write unit tests for these functions.
    *   Ensure each test asserts the expected behavior, including:
        *   Correct arguments passed to mocked Firebase functions.
        *   Correct return values or error handling.
        *   Edge cases (e.g., empty data, error conditions if applicable).
4.  **Coverage**: Aim for good statement and branch coverage for `src/lib/firestore.ts`.
5.  **Run tests**: Use `npm test` (or `vitest`) to confirm all new tests pass.

**Example of mocking pattern (adapt as needed):**

```typescript
// src/__tests__/firestore.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestore from 'firebase/firestore'; // Import real module for types

// Mock the entire firebase/firestore module
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal<typeof firestore>();
  return {
    ...original,
    getFirestore: vi.fn(() => ({})), // Mock getFirestore to return a mock db object
    collection: vi.fn(() => ({})), // Mock collection
    doc: vi.fn(() => ({})), // Mock doc
    addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })), // Mock addDoc
    getDocs: vi.fn(() => Promise.resolve({
      forEach: (cb: any) => { /* mock data iteration */ },
      docs: [{ id: 'doc1', data: () => ({ /* data */ }) }]
    })),
    // ... mock other Firestore functions like updateDoc, deleteDoc, query, where, etc.
  };
});

// Import the module under test
import { /* your functions from firestore.ts */ } from '../lib/firestore';

describe('firestore.ts helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should call addDoc when creating a nail item', async () => {
    // Test logic here
  });

  // ... more tests
});
```
